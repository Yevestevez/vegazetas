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

test.describe('edit recipe', () => {
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

  test('editar título y guardar actualiza la receta', async ({ page, request }) => {
    const response = await request.post(`${apiUrl}/users`, { data: user })
    expect(response.status()).toBe(201)

    await page.goto('/login')
    await page.getByLabel('Email').fill(user.email)
    await page.getByLabel('Contraseña', { exact: true }).fill(user.password)
    await page.getByRole('button', { name: 'Inicio' }).click()

    await page.goto(`/update-recipe/${recipeId}`)
    await expect(page.getByText('Edita tu receta')).toBeVisible()

    const titleInput = page.getByLabel('Título*')
    await titleInput.fill('')
    await titleInput.fill('Título editado')

    await page.route(`${apiUrl}/recipes/${recipeId}`, route => {
      if (route.request().method() === 'PATCH') {
        return route.fulfill({ status: 204 })
      }
      return route.continue()
    })

    await page.getByRole('button', { name: 'Guardar' }).nth(0).click()
    await expect(page.getByText('Receta actualizada')).toBeVisible()
    await page.getByRole('button', { name: 'Aceptar' }).click()
  })

  test('editar descripción y guardar actualiza la receta', async ({ page, request }) => {
    const response = await request.post(`${apiUrl}/users`, { data: user })
    expect(response.status()).toBe(201)

    await page.goto('/login')
    await page.getByLabel('Email').fill(user.email)
    await page.getByLabel('Contraseña', { exact: true }).fill(user.password)
    await page.getByRole('button', { name: 'Inicio' }).click()

    await page.goto(`/update-recipe/${recipeId}`)

    const descInput = page.getByLabel('Descripción')
    await descInput.fill('Una descripción deliciosa')

    await page.route(`${apiUrl}/recipes/${recipeId}`, route => {
      if (route.request().method() === 'PATCH') {
        return route.fulfill({ status: 204 })
      }
      return route.continue()
    })

    await page.getByRole('button', { name: 'Guardar' }).nth(0).click()
    await expect(page.getByText('Receta actualizada')).toBeVisible()
    await page.getByRole('button', { name: 'Aceptar' }).click()
  })

  test('editar dificultad y guardar actualiza la receta', async ({ page, request }) => {
    const response = await request.post(`${apiUrl}/users`, { data: user })
    expect(response.status()).toBe(201)

    await page.goto('/login')
    await page.getByLabel('Email').fill(user.email)
    await page.getByLabel('Contraseña', { exact: true }).fill(user.password)
    await page.getByRole('button', { name: 'Inicio' }).click()

    await page.goto(`/update-recipe/${recipeId}`)

    await page.selectOption('select#difficulty', 'medium')

    await page.route(`${apiUrl}/recipes/${recipeId}`, route => {
      if (route.request().method() === 'PATCH') {
        return route.fulfill({ status: 204 })
      }
      return route.continue()
    })

    await page.getByRole('button', { name: 'Guardar' }).nth(0).click()
    await expect(page.getByText('Receta actualizada')).toBeVisible()
    await page.getByRole('button', { name: 'Aceptar' }).click()
  })

  test('editar tiempo y guardar actualiza la receta', async ({ page, request }) => {
    const response = await request.post(`${apiUrl}/users`, { data: user })
    expect(response.status()).toBe(201)

    await page.goto('/login')
    await page.getByLabel('Email').fill(user.email)
    await page.getByLabel('Contraseña', { exact: true }).fill(user.password)
    await page.getByRole('button', { name: 'Inicio' }).click()

    await page.goto(`/update-recipe/${recipeId}`)

    const timeInput = page.getByLabel('Tiempo (min)')
    await timeInput.fill('30')

    await page.route(`${apiUrl}/recipes/${recipeId}`, route => {
      if (route.request().method() === 'PATCH') {
        return route.fulfill({ status: 204 })
      }
      return route.continue()
    })

    await page.getByRole('button', { name: 'Guardar' }).nth(0).click()
    await expect(page.getByText('Receta actualizada')).toBeVisible()
    await page.getByRole('button', { name: 'Aceptar' }).click()
  })

  test('añadir etiqueta y guardar actualiza la receta', async ({ page, request }) => {
    const response = await request.post(`${apiUrl}/users`, { data: user })
    expect(response.status()).toBe(201)

    await page.goto('/login')
    await page.getByLabel('Email').fill(user.email)
    await page.getByLabel('Contraseña', { exact: true }).fill(user.password)
    await page.getByRole('button', { name: 'Inicio' }).click()

    await page.goto(`/update-recipe/${recipeId}`)

    await page.route(`${apiUrl}/recipes/${recipeId}/tags`, route => {
      if (route.request().method() === 'POST') {
        return route.fulfill({ status: 201 })
      }
      return route.continue()
    })

    const tagInput = page.getByLabel('Nueva etiqueta')
    await tagInput.fill('vegetariano')

    const tagsRegion = page.getByRole('region', { name: 'Etiquetas' })
    await tagsRegion.getByRole('button', { name: 'Guardar' }).click()

    await expect(page.getByText('#vegetariano')).toBeVisible({ timeout: 5000 })
  })

  test('eliminar etiqueta con confirmación', async ({ page, request }) => {
    const response = await request.post(`${apiUrl}/users`, { data: user })
    expect(response.status()).toBe(201)

    const recipeWithTag = { ...mockRecipe, tags: ['vegetariano'] }

    await page.route(`${apiUrl}/recipes/${recipeId}`, route => {
      if (route.request().method() === 'GET') {
        return route.fulfill({ json: recipeWithTag })
      }
      return route.continue()
    })

    await page.goto('/login')
    await page.getByLabel('Email').fill(user.email)
    await page.getByLabel('Contraseña', { exact: true }).fill(user.password)
    await page.getByRole('button', { name: 'Inicio' }).click()

    await page.goto(`/update-recipe/${recipeId}`)
    await expect(page.getByText('#vegetariano')).toBeVisible()

    await page.route(`${apiUrl}/recipes/${recipeId}/tags/0`, route => {
      if (route.request().method() === 'DELETE') {
        return route.fulfill({ status: 204 })
      }
      return route.continue()
    })

    const tagsRegion = page.getByRole('region', { name: 'Etiquetas' })
    await tagsRegion.getByRole('button', { name: 'Eliminar etiqueta' }).click()
    await page.getByRole('button', { name: 'Aceptar' }).click()
    await expect(page.getByText('#vegetariano')).not.toBeVisible({ timeout: 5000 })
  })
})
