import { randomUUID } from 'node:crypto'
import { expect, test } from '@playwright/test'
import { removeE2eUser } from '../../api/test/e2eDatabase.js'

const apiUrl = 'http://127.0.0.1:32123'
const recipeId = '507f1f77bcf86cd71939dd1e'

const mockRecipe = {
  id: recipeId,
  title: 'Receta de prueba',
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

test.describe('ingredients', () => {
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

    await page.route(`${apiUrl}/recipes/${recipeId}`, route => {
      if (route.request().method() === 'GET') {
        return route.fulfill({ json: mockRecipe })
      }
      return route.continue()
    })
  })

  test.afterEach(async () => {
    if (user) {
      const { email } = user
      user = undefined
      await removeE2eUser(email)
    }
  })

  test('añadir ingrediente en SaveRecipe', async ({ page, request }) => {
    const response = await request.post(`${apiUrl}/users`, { data: user })
    expect(response.status()).toBe(201)

    await page.goto('/login')
    await page.getByLabel('Email').fill(user.email)
    await page.getByLabel('Contraseña', { exact: true }).fill(user.password)
    await page.getByRole('button', { name: 'Inicio' }).click()

    await page.goto(`/update-recipe/${recipeId}`)
    await expect(page.getByRole('heading', { name: 'Ingredientes' })).toBeVisible()

    const newIngredientSection = page.getByRole('heading', { name: 'Nuevo ingrediente' }).locator('..')

    await page.route(`${apiUrl}/recipes/${recipeId}/ingredients`, route => {
      if (route.request().method() === 'POST') {
        return route.fulfill({ status: 201, json: { id: '507f191e810c19729de860eb' } })
      }
      return route.continue()
    })

    await newIngredientSection.getByLabel('Nombre*').fill('Tomate')
    await newIngredientSection.getByLabel('Cantidad*').fill('2')
    await newIngredientSection.getByLabel('Unidad*').fill('uds')
    await newIngredientSection.getByRole('button', { name: 'Guardar' }).click()

    await expect(page.getByText('Tomate')).toBeVisible()
  })

  test('eliminar ingrediente con confirmación', async ({ page, request }) => {
    const response = await request.post(`${apiUrl}/users`, { data: user })
    expect(response.status()).toBe(201)

    const recipeWithIngredient = {
      ...mockRecipe,
      ingredients: [{ id: '507f191e810c19729de860ea', name: 'Tomate', quantity: 2, unit: 'uds', main: true }]
    }

    await page.route(`${apiUrl}/recipes/${recipeId}`, route => {
      if (route.request().method() === 'GET') {
        return route.fulfill({ json: recipeWithIngredient })
      }
      return route.continue()
    })

    await page.goto('/login')
    await page.getByLabel('Email').fill(user.email)
    await page.getByLabel('Contraseña', { exact: true }).fill(user.password)
    await page.getByRole('button', { name: 'Inicio' }).click()

    await page.goto(`/update-recipe/${recipeId}`)
    await expect(page.getByText('Tomate')).toBeVisible()

    await page.route(`${apiUrl}/recipes/${recipeId}/ingredients/507f191e810c19729de860ea`, route => {
      if (route.request().method() === 'DELETE') {
        return route.fulfill({ status: 204 })
      }
      return route.continue()
    })

    const ingredientsSection = page.getByRole('heading', { name: 'Ingredientes' }).locator('..')
    await ingredientsSection.getByRole('button', { name: 'Eliminar ingrediente' }).click()
    await page.getByRole('button', { name: 'Aceptar' }).click()
    await expect(page.getByText('Tomate')).not.toBeVisible({ timeout: 5000 })
  })

  test('validación de ingrediente sin nombre muestra alerta', async ({ page, request }) => {
    const response = await request.post(`${apiUrl}/users`, { data: user })
    expect(response.status()).toBe(201)

    await page.goto('/login')
    await page.getByLabel('Email').fill(user.email)
    await page.getByLabel('Contraseña', { exact: true }).fill(user.password)
    await page.getByRole('button', { name: 'Inicio' }).click()

    await page.goto(`/update-recipe/${recipeId}`)

    const newIngredientSection = page.getByRole('heading', { name: 'Nuevo ingrediente' }).locator('..')

    // Bypass HTML5 required validation
    await page.evaluate(() => {
      const input = document.getElementById('name')
      if (input) input.removeAttribute('required')
      const quantity = document.getElementById('quantity')
      if (quantity) quantity.removeAttribute('required')
      const unit = document.getElementById('unit')
      if (unit) unit.removeAttribute('required')
    })

    await newIngredientSection.getByLabel('Cantidad*').fill('1')
    await newIngredientSection.getByLabel('Unidad*').fill('g')
    await newIngredientSection.getByRole('button', { name: 'Guardar' }).click()

    await expect(page.getByText('El ingrediente debe tener un nombre')).toBeVisible()
    await page.getByRole('button', { name: 'Aceptar' }).click()
  })
})
