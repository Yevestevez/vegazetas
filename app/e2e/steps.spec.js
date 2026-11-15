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

test.describe('steps', () => {
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

  test('añadir paso en SaveRecipe', async ({ page, request }) => {
    const response = await request.post(`${apiUrl}/users`, { data: user })
    expect(response.status()).toBe(201)

    await page.goto('/login')
    await page.getByLabel('Email').fill(user.email)
    await page.getByLabel('Contraseña', { exact: true }).fill(user.password)
    await page.getByRole('button', { name: 'Inicio' }).click()

    await page.goto(`/update-recipe/${recipeId}`)
    await expect(page.getByRole('heading', { name: 'Pasos' })).toBeVisible()

    const newStepSection = page.getByRole('heading', { name: 'Nuevo Paso' }).locator('..')

    await page.route(`${apiUrl}/recipes/${recipeId}/steps`, route => {
      if (route.request().method() === 'POST') {
        return route.fulfill({ status: 201, json: { id: '507f191e810c19729de860ea' } })
      }
      return route.continue()
    })

    await newStepSection.getByLabel('Instrucciones*').fill('Mezclar los ingredientes')
    await newStepSection.getByRole('button', { name: 'Guardar' }).click()

    await expect(page.getByText('Mezclar los ingredientes')).toBeVisible()
  })

  test('eliminar paso con confirmación', async ({ page, request }) => {
    const response = await request.post(`${apiUrl}/users`, { data: user })
    expect(response.status()).toBe(201)

    const recipeWithStep = {
      ...mockRecipe,
      steps: [{ id: '507f191e810c19729de860ea', text: 'Mezclar los ingredientes', order: 0 }]
    }

    await page.route(`${apiUrl}/recipes/${recipeId}`, route => {
      if (route.request().method() === 'GET') {
        return route.fulfill({ json: recipeWithStep })
      }
      return route.continue()
    })

    await page.goto('/login')
    await page.getByLabel('Email').fill(user.email)
    await page.getByLabel('Contraseña', { exact: true }).fill(user.password)
    await page.getByRole('button', { name: 'Inicio' }).click()

    await page.goto(`/update-recipe/${recipeId}`)
    await expect(page.getByText('Mezclar los ingredientes')).toBeVisible()

    await page.route(`${apiUrl}/recipes/${recipeId}/steps/507f191e810c19729de860ea`, route => {
      if (route.request().method() === 'DELETE') {
        return route.fulfill({ status: 204 })
      }
      return route.continue()
    })

    const stepsSection = page.getByRole('heading', { name: 'Pasos' }).locator('..')
    await stepsSection.getByRole('button', { name: 'Eliminar paso' }).click()
    await page.getByRole('button', { name: 'Aceptar' }).click()
    await expect(page.getByText('Mezclar los ingredientes')).not.toBeVisible({ timeout: 5000 })
  })

  test('mover paso arriba', async ({ page, request }) => {
    const response = await request.post(`${apiUrl}/users`, { data: user })
    expect(response.status()).toBe(201)

    const recipeWithSteps = {
      ...mockRecipe,
      steps: [
        { id: '507f191e810c19729de860e1', text: 'Paso uno', order: 0 },
        { id: '507f191e810c19729de860e2', text: 'Paso dos', order: 1 }
      ]
    }

    await page.route(`${apiUrl}/recipes/${recipeId}`, route => {
      if (route.request().method() === 'GET') {
        return route.fulfill({ json: recipeWithSteps })
      }
      return route.continue()
    })

    await page.goto('/login')
    await page.getByLabel('Email').fill(user.email)
    await page.getByLabel('Contraseña', { exact: true }).fill(user.password)
    await page.getByRole('button', { name: 'Inicio' }).click()

    await page.goto(`/update-recipe/${recipeId}`)

    await page.route(`${apiUrl}/recipes/${recipeId}/steps/507f191e810c19729de860e2/reorder`, route => {
      if (route.request().method() === 'PATCH') {
        return route.fulfill({ status: 204 })
      }
      return route.continue()
    })

    // Click "Subir paso" on the second step
    const stepsSection = page.getByRole('heading', { name: 'Pasos' }).locator('..')
    const step2Li = stepsSection.locator('li').nth(1)
    await step2Li.getByRole('button', { name: 'Subir paso' }).click()

    // After reorder, step order should swap in the DOM
    const stepTexts = stepsSection.locator('li strong')
    await expect(stepTexts.nth(0)).toHaveText('Paso dos')
  })

  test('mover paso abajo', async ({ page, request }) => {
    const response = await request.post(`${apiUrl}/users`, { data: user })
    expect(response.status()).toBe(201)

    const recipeWithSteps = {
      ...mockRecipe,
      steps: [
        { id: '507f191e810c19729de860e1', text: 'Paso uno', order: 0 },
        { id: '507f191e810c19729de860e2', text: 'Paso dos', order: 1 }
      ]
    }

    await page.route(`${apiUrl}/recipes/${recipeId}`, route => {
      if (route.request().method() === 'GET') {
        return route.fulfill({ json: recipeWithSteps })
      }
      return route.continue()
    })

    await page.goto('/login')
    await page.getByLabel('Email').fill(user.email)
    await page.getByLabel('Contraseña', { exact: true }).fill(user.password)
    await page.getByRole('button', { name: 'Inicio' }).click()

    await page.goto(`/update-recipe/${recipeId}`)

    await page.route(`${apiUrl}/recipes/${recipeId}/steps/507f191e810c19729de860e1/reorder`, route => {
      if (route.request().method() === 'PATCH') {
        return route.fulfill({ status: 204 })
      }
      return route.continue()
    })

    // Click "Bajar paso" on the first step
    const stepsSection = page.getByRole('heading', { name: 'Pasos' }).locator('..')
    const step1Li = stepsSection.locator('li').nth(0)
    await step1Li.getByRole('button', { name: 'Bajar paso' }).click()

    // After reorder, step order should swap in the DOM
    const stepTexts = stepsSection.locator('li strong')
    await expect(stepTexts.nth(0)).toHaveText('Paso dos')
  })
})
