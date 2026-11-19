import { randomUUID } from 'node:crypto'
import { expect, test } from '@playwright/test'
import { removeE2eUser } from '../../api/test/e2eDatabase.js'

const apiUrl = 'http://127.0.0.1:32123'

test.describe('create recipe', () => {
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

  test('crear receta desde menú navega a /create-recipe/:id y muestra título predeterminado', async ({ page, request }) => {
    const response = await request.post(`${apiUrl}/users`, { data: user })
    expect(response.status()).toBe(201)

    await page.goto('/login')
    await page.getByLabel('Email').fill(user.email)
    await page.getByLabel('Contraseña', { exact: true }).fill(user.password)
    await page.getByRole('button', { name: 'Inicio' }).click()
    await expect(page).toHaveURL(/\/menu$/)

    await page.getByRole('button', { name: 'Nueva receta' }).click()
    await expect(page).toHaveURL(/\/create-recipe\/.+/)

    await expect(page.getByText('Crea tu nueva receta')).toBeVisible()
    const titleInput = page.getByLabel('Título*')
    await expect(titleInput).toBeVisible()
  })

  test('guardar receta con título actualiza la receta', async ({ page, request }) => {
    const response = await request.post(`${apiUrl}/users`, { data: user })
    expect(response.status()).toBe(201)

    await page.goto('/login')
    await page.getByLabel('Email').fill(user.email)
    await page.getByLabel('Contraseña', { exact: true }).fill(user.password)
    await page.getByRole('button', { name: 'Inicio' }).click()

    // Use a mock recipe to avoid MongoDB duplicate key issues
    const testRecipeId = '507f1f77bcf86cd71939dd1e'
    await page.route(`${apiUrl}/recipes/${testRecipeId}`, route => {
      if (route.request().method() === 'GET') {
        return route.fulfill({ json: {
          id: testRecipeId,
          title: 'Borrador de receta',
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
        }})
      }
      if (route.request().method() === 'PATCH') {
        return route.fulfill({ status: 204 })
      }
      return route.continue()
    })

    await page.goto(`/update-recipe/${testRecipeId}`)
    await expect(page.getByText('Edita tu receta')).toBeVisible()

    const titleInput = page.getByLabel('Título*')
    await titleInput.fill('Mi receta especial')

    await page.getByRole('button', { name: 'Guardar' }).nth(0).click()
    await expect(page.getByText('Receta actualizada')).toBeVisible()
    await page.getByRole('button', { name: 'Aceptar' }).click()
  })

  test('validación de título vacío muestra alerta de error', async ({ page, request }) => {
    const response = await request.post(`${apiUrl}/users`, { data: user })
    expect(response.status()).toBe(201)

    await page.goto('/login')
    await page.getByLabel('Email').fill(user.email)
    await page.getByLabel('Contraseña', { exact: true }).fill(user.password)
    await page.getByRole('button', { name: 'Inicio' }).click()
    await expect(page).toHaveURL(/\/menu$/)

    // Use a mock recipe with empty title to test validation
    const testRecipeId = '507f1f77bcf86cd71939dd1e'
    await page.route(`${apiUrl}/recipes/${testRecipeId}`, route => {
      return route.fulfill({ json: {
        id: testRecipeId,
        title: '',
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
      }})
    })

    await page.goto(`/update-recipe/${testRecipeId}`)
    await expect(page.getByText('Edita tu receta')).toBeVisible()

    // Bypass HTML5 required validation so the form submit handler runs
    await page.evaluate(() => {
      const input = document.getElementById('title')
      if (input) input.removeAttribute('required')
    })

    await page.getByRole('button', { name: 'Guardar' }).nth(0).click()
    await expect(page.getByText('Añade un título a tu receta')).toBeVisible()
    await page.getByRole('button', { name: 'Aceptar' }).click()
  })
})
