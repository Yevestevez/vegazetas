import { randomUUID } from 'node:crypto'
import { expect, test } from '@playwright/test'
import { removeE2eUser } from '../../api/test/e2eDatabase.js'

const apiUrl = 'http://127.0.0.1:32123'
const recipeId = '507f1f77bcf86cd71939dd1e'

const baseRecipe = {
  id: recipeId,
  title: 'Receta de prueba',
  published: false,
  isFavorite: false,
  own: true,
  images: [],
  author: { username: 'testuser' },
  date: '2026-01-01T12:00:00.000Z',
  description: 'Descripción de prueba',
  time: 30,
  difficulty: 'easy',
  tags: ['vegetariano'],
  ingredients: [
    { id: '507f191e810c19729de860ea', name: 'Tomate', quantity: 2, unit: 'uds', main: true }
  ],
  steps: [
    { id: '507f191e810c19729de860eb', text: 'Mezclar los ingredientes', order: 0 }
  ]
}

test.describe('recipe actions', () => {
  let user

  test.beforeEach(async ({ page }) => {
    const id = randomUUID()
    user = {
      name: 'Test User',
      email: `e2e-${id}@example.invalid`,
      username: `e2e-${id.slice(0, 8)}`,
      password: 'Testpass123'
    }

    await page.route('**/*', route => {
      const { origin } = new URL(route.request().url())
      return origin === 'http://127.0.0.1:4173' || origin === apiUrl
        ? route.continue()
        : route.abort()
    })
  })

  test.afterEach(async () => {
    if (user) {
      const { email } = user
      user = undefined
      await removeE2eUser(email)
    }
  })

  test('ver receta completa muestra título, ingredientes y pasos', async ({ page, request }) => {
    const response = await request.post(`${apiUrl}/users`, { data: user })
    expect(response.status()).toBe(201)

    await page.route(`${apiUrl}/recipes/${recipeId}`, route => {
      if (route.request().method() === 'GET') return route.fulfill({ json: baseRecipe })
      return route.continue()
    })

    await page.goto('/login')
    await page.getByLabel('Email').fill(user.email)
    await page.getByLabel('Contraseña', { exact: true }).fill(user.password)
    await page.getByRole('button', { name: 'Inicio' }).click()

    await page.goto(`/recipe/${recipeId}`)
    await expect(page.getByText('Receta de prueba')).toBeVisible()
    await expect(page.getByText('Tomate')).toBeVisible()
    await expect(page.getByText('Mezclar los ingredientes')).toBeVisible()
  })

  test('toggle favorito en receta cambia estado', async ({ page, request }) => {
    const response = await request.post(`${apiUrl}/users`, { data: user })
    expect(response.status()).toBe(201)

    let favoriteCalled = false
    await page.route(`${apiUrl}/users/favorites/${recipeId}`, route => {
      favoriteCalled = true
      return route.fulfill({ json: {} })
    })

    let getCallCount = 0
    await page.route(`${apiUrl}/recipes/${recipeId}`, route => {
      getCallCount++
      if (route.request().method() === 'GET') {
        const recipe = getCallCount === 1 ? baseRecipe : { ...baseRecipe, isFavorite: true }
        return route.fulfill({ json: recipe })
      }
      return route.continue()
    })

    await page.goto('/login')
    await page.getByLabel('Email').fill(user.email)
    await page.getByLabel('Contraseña', { exact: true }).fill(user.password)
    await page.getByRole('button', { name: 'Inicio' }).click()

    await page.goto(`/recipe/${recipeId}`)
    await expect(page.getByText('Receta de prueba')).toBeVisible()

    const star = page.getByRole('button', { name: 'Añadir a favoritos' })
    await expect(star).toBeVisible()
    await star.click()

    await expect(page.getByText('Receta añadida a favoritos')).toBeVisible()
    await page.getByRole('button', { name: 'Aceptar' }).click()
    expect(favoriteCalled).toBe(true)
  })

  test('eliminar receta desde Recipe navega a MyRecipes', async ({ page, request }) => {
    const response = await request.post(`${apiUrl}/users`, { data: user })
    expect(response.status()).toBe(201)

    await page.route(`${apiUrl}/recipes/${recipeId}`, route => {
      if (route.request().method() === 'GET') return route.fulfill({ json: baseRecipe })
      if (route.request().method() === 'DELETE') return route.fulfill({ status: 204 })
      return route.continue()
    })
    await page.route(`${apiUrl}/recipes/my-recipes`, route => route.fulfill({ json: [] }))

    await page.goto('/login')
    await page.getByLabel('Email').fill(user.email)
    await page.getByLabel('Contraseña', { exact: true }).fill(user.password)
    await page.getByRole('button', { name: 'Inicio' }).click()

    await page.goto(`/recipe/${recipeId}`)
    await expect(page.getByText('Receta de prueba')).toBeVisible()

    const deleteBtn = page.getByRole('button', { name: 'Eliminar receta' })
    await expect(deleteBtn).toBeVisible()
    await deleteBtn.click()

    await page.getByRole('button', { name: 'Aceptar' }).click()
    await expect(page).toHaveURL(/\/my-recipes$/)
  })

  test('editar desde Recipe navega a SaveRecipe', async ({ page, request }) => {
    const response = await request.post(`${apiUrl}/users`, { data: user })
    expect(response.status()).toBe(201)

    await page.route(`${apiUrl}/recipes/${recipeId}`, route => {
      if (route.request().method() === 'GET') return route.fulfill({ json: baseRecipe })
      return route.continue()
    })

    await page.goto('/login')
    await page.getByLabel('Email').fill(user.email)
    await page.getByLabel('Contraseña', { exact: true }).fill(user.password)
    await page.getByRole('button', { name: 'Inicio' }).click()

    await page.goto(`/recipe/${recipeId}`)

    const editBtn = page.getByRole('button', { name: 'Editar receta' })
    await expect(editBtn).toBeVisible()
    await editBtn.click()

    await expect(page).toHaveURL(/\/update-recipe\/.+/)
  })

  test('botón atrás en receta navega hacia atrás', async ({ page, request }) => {
    const response = await request.post(`${apiUrl}/users`, { data: user })
    expect(response.status()).toBe(201)

    await page.route(`${apiUrl}/recipes/${recipeId}`, route => {
      if (route.request().method() === 'GET') return route.fulfill({ json: baseRecipe })
      return route.continue()
    })
    await page.route(`${apiUrl}/recipes/my-recipes`, route => route.fulfill({ json: [] }))

    await page.goto('/login')
    await page.getByLabel('Email').fill(user.email)
    await page.getByLabel('Contraseña', { exact: true }).fill(user.password)
    await page.getByRole('button', { name: 'Inicio' }).click()
    await expect(page).toHaveURL(/\/menu$/)

    // Navigate from menu to my-recipes, then to recipe
    await page.getByRole('link', { name: 'Mis recetas' }).click()
    await expect(page).toHaveURL(/\/my-recipes$/)

    // Go to recipe page directly
    await page.goto(`/recipe/${recipeId}`)
    await expect(page.getByText('Receta de prueba')).toBeVisible()

    const backBtn = page.getByRole('button', { name: 'Atrás' })
    await backBtn.click()

    // Should navigate back to the previous page (my-recipes)
    await expect(page).toHaveURL(/\/my-recipes$/)
  })

  test('botones deshabilitados muestran alert', async ({ page, request }) => {
    const response = await request.post(`${apiUrl}/users`, { data: user })
    expect(response.status()).toBe(201)

    await page.route(`${apiUrl}/recipes/${recipeId}`, route => {
      if (route.request().method() === 'GET') return route.fulfill({ json: baseRecipe })
      return route.continue()
    })

    await page.goto('/login')
    await page.getByLabel('Email').fill(user.email)
    await page.getByLabel('Contraseña', { exact: true }).fill(user.password)
    await page.getByRole('button', { name: 'Inicio' }).click()

    await page.goto(`/recipe/${recipeId}`)

    const addToListBtn = page.getByRole('button', { name: 'Añadir a lista' })
    await addToListBtn.click()
    await expect(page.getByText('Añadir a lista: funcionalidad en el horno')).toBeVisible()
    await page.getByRole('button', { name: 'Aceptar' }).click()

    const shareBtn = page.getByRole('button', { name: 'Compartir receta' })
    await shareBtn.click()
    await expect(page.getByText('Compartir: funcionalidad cociendose a fuego lento')).toBeVisible()
    await page.getByRole('button', { name: 'Aceptar' }).click()
  })
})
