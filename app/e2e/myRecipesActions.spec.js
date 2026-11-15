import { randomUUID } from 'node:crypto'
import { expect, test } from '@playwright/test'
import { removeE2eUser } from '../../api/test/e2eDatabase.js'

const apiUrl = 'http://127.0.0.1:32123'
const recipeId = '507f1f77bcf86cd71939dd1e'

test.describe('my recipes actions', () => {
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

  test('botones deshabilitados en MyRecipeThumbnail muestran alert', async ({ page, request }) => {
    const response = await request.post(`${apiUrl}/users`, { data: user })
    expect(response.status()).toBe(201)

    const recipes = [{
      id: recipeId,
      title: 'Mi receta',
      published: false,
      isFavorite: false,
      images: [],
      date: '2026-01-01T12:00:00.000Z'
    }]

    await page.route(`${apiUrl}/recipes/my-recipes`, route => route.fulfill({ json: recipes }))

    await page.goto('/login')
    await page.getByLabel('Email').fill(user.email)
    await page.getByLabel('Contraseña', { exact: true }).fill(user.password)
    await page.getByRole('button', { name: 'Inicio' }).click()

    await page.goto('/my-recipes')
    await expect(page.getByText('Mi receta')).toBeVisible()

    // Click "Añadir a lista" button on the thumbnail
    const addToListBtn = page.getByRole('button', { name: 'Añadir a lista' })
    await addToListBtn.click()
    await expect(page.getByText('Añadir a lista: funcionalidad en el horno')).toBeVisible()
    await page.getByRole('button', { name: 'Aceptar' }).click()

    // Click "Compartir receta" button on the thumbnail
    const shareBtn = page.getByRole('button', { name: 'Compartir receta' })
    await shareBtn.click()
    await expect(page.getByText('Compartir: funcionalidad cociendose a fuego lento')).toBeVisible()
    await page.getByRole('button', { name: 'Aceptar' }).click()
  })

  test('publicar receta desde SaveRecipe', async ({ page, request }) => {
    const response = await request.post(`${apiUrl}/users`, { data: user })
    expect(response.status()).toBe(201)

    const draftRecipe = {
      id: recipeId,
      title: 'Receta borrador',
      published: false,
      isFavorite: false,
      own: true,
      images: [],
      description: null,
      time: undefined,
      difficulty: undefined,
      tags: [],
      ingredients: [],
      steps: []
    }

    let published = false
    await page.route(`${apiUrl}/recipes/${recipeId}`, route => {
      if (route.request().method() === 'GET') {
        return route.fulfill({ json: { ...draftRecipe, published } })
      }
      return route.continue()
    })
    await page.route(`${apiUrl}/recipes/${recipeId}/publish`, route => {
      published = !published
      return route.fulfill({ json: { published } })
    })

    await page.goto('/login')
    await page.getByLabel('Email').fill(user.email)
    await page.getByLabel('Contraseña', { exact: true }).fill(user.password)
    await page.getByRole('button', { name: 'Inicio' }).click()

    await page.goto(`/update-recipe/${recipeId}`)
    await expect(page.getByText('borrador').first()).toBeVisible()

    // Click publish button (first one - there are two for mobile/desktop)
    await page.getByRole('button', { name: 'Publicar receta' }).first().click()
    await page.getByRole('button', { name: 'Aceptar' }).click()

    // After publish, should show "publicada"
    await expect(page.getByText('publicada').first()).toBeVisible({ timeout: 5000 })
  })
})
