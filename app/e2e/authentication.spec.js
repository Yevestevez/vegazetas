import { randomUUID } from 'node:crypto'
import { expect, test } from '@playwright/test'
import { removeE2eUser } from '../../api/test/e2eDatabase.js'

const apiUrl = 'http://127.0.0.1:32123'

test.describe('authentication', () => {
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

  test('registers a user and opens the login page', async ({ page }) => {
    await page.goto('/register')
    await page.getByLabel('Nombre').fill(user.name)
    await page.getByLabel('Email').fill(user.email)
    await page.getByLabel('Usuario').fill(user.username)
    await page.getByLabel('Contraseña', { exact: true }).fill(user.password)
    await page.getByRole('button', { name: 'Registro' }).click()

    await expect(page).toHaveURL(/\/login$/)
    await expect(page.getByRole('button', { name: 'Inicio' })).toBeVisible()
  })

  test('signs in, shows the user name and signs out', async ({ page, request }) => {
    const response = await request.post(`${apiUrl}/users`, { data: user })
    expect(response.status()).toBe(201)

    await page.goto('/login')
    await page.getByLabel('Email').fill(user.email)
    await page.getByLabel('Contraseña', { exact: true }).fill(user.password)
    await page.getByRole('button', { name: 'Inicio' }).click()

    await expect(page).toHaveURL(/\/menu$/)
    await expect(page.getByText(user.name, { exact: true })).toBeVisible()
    await page.getByRole('button', { name: 'Cerrar sesión' }).click()
    await page.getByRole('button', { name: 'Aceptar' }).click()
    await expect(page).toHaveURL(/\/login$/)
  })

  test('rejects an incorrect password', async ({ page, request }) => {
    const response = await request.post(`${apiUrl}/users`, { data: user })
    expect(response.status()).toBe(201)

    await page.goto('/login')
    await page.getByLabel('Email').fill(user.email)
    await page.getByLabel('Contraseña', { exact: true }).fill('Wrongpass123')
    await page.getByRole('button', { name: 'Inicio' }).click()

    await expect(page.getByText('wrong credentials', { exact: true })).toBeVisible()
    await expect(page).toHaveURL(/\/login$/)
  })

  test('signs out and shows a message when the session token is invalid', async ({ page }) => {
    await page.goto('/landing')
    await page.evaluate(() => { sessionStorage.token = 'invalid-token' })

    await page.goto('/menu')

    await expect(page).toHaveURL(/\/login$/)
    await expect(page.getByText('Tu sesión no es válida o ha caducado. Inicia sesión de nuevo.')).toBeVisible()
    expect(await page.evaluate(() => sessionStorage.getItem('token'))).toBeNull()
  })

  test('keeps the session when the name request fails on the server', async ({ page }) => {
    await page.route(`${apiUrl}/users/name`, route => route.fulfill({
      status: 500,
      json: { error: 'SystemError', message: 'internal server error' }
    }))
    await page.goto('/landing')
    await page.evaluate(() => { sessionStorage.token = 'test-token' })

    await page.goto('/menu')

    await expect(page.getByText('sorry, try again')).toBeVisible()
    await expect(page).toHaveURL(/\/menu$/)
    expect(await page.evaluate(() => sessionStorage.getItem('token'))).toBe('test-token')
  })

  test('does not reload the user name when an unrelated alert is shown', async ({ page }) => {
    let reads = 0
    await page.route(`${apiUrl}/users/name`, route => {
      reads++
      return route.fulfill({ json: 'Test User' })
    })
    await page.goto('/landing')
    await page.evaluate(() => { sessionStorage.token = 'test-token' })
    await page.goto('/menu')
    await expect(page.getByText('Test User', { exact: true })).toBeVisible()

    await page.getByRole('button', { name: '¡Listas y más listas!' }).click()
    await expect(page.getByText('Funcionalidad en el horno')).toBeVisible()
    await page.getByRole('button', { name: 'Aceptar' }).click()
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))

    expect(reads).toBe(1)
  })

  for (const path of ['recipe', 'update-recipe']) {
    test(`signs out when loading ${path} with an invalid token`, async ({ page }) => {
      await page.goto('/landing')
      await page.evaluate(() => { sessionStorage.token = 'invalid-token' })

      await page.goto(`/${path}/aaaaaaaaaaaaaaaaaaaaaaaa`)

      await expect(page).toHaveURL(/\/login$/)
      await expect(page.getByText('Tu sesión no es válida o ha caducado. Inicia sesión de nuevo.')).toBeVisible()
      expect(await page.evaluate(() => sessionStorage.getItem('token'))).toBeNull()
    })
  }

  for (const path of ['my-recipes', 'discover', 'favorites']) {
    test(`signs out when loading ${path} with an invalid token`, async ({ page }) => {
      await page.goto('/landing')
      await page.evaluate(() => { sessionStorage.token = 'invalid-token' })

      await page.goto(`/${path}`)

      await expect(page).toHaveURL(/\/login$/)
      await expect(page.getByText('Tu sesión no es válida o ha caducado. Inicia sesión de nuevo.')).toBeVisible()
      expect(await page.evaluate(() => sessionStorage.getItem('token'))).toBeNull()
    })
  }

  test('ignores a late list authentication error after leaving the page', async ({ page }) => {
    let release
    const gate = new Promise(resolve => { release = resolve })
    await page.route(`${apiUrl}/recipes/my-recipes`, async route => {
      await gate
      await route.fulfill({ status: 401, json: { error: 'CredentialsError', message: 'invalid credentials' } })
    })
    await page.route(`${apiUrl}/users/name`, route => route.fulfill({ json: 'Test User' }))
    await page.goto('/landing')
    await page.evaluate(() => { sessionStorage.token = 'test-token' })
    const requested = page.waitForRequest(`${apiUrl}/recipes/my-recipes`)
    await page.goto('/my-recipes')
    await requested

    await page.getByRole('link', { name: 'Ir al menú' }).click()
    await expect(page.getByText('Test User', { exact: true })).toBeVisible()
    const response = page.waitForResponse(`${apiUrl}/recipes/my-recipes`)
    release()
    await response
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))

    await expect(page).toHaveURL(/\/menu$/)
    expect(await page.evaluate(() => sessionStorage.getItem('token'))).toBe('test-token')
  })

  test('shows and updates an own favorite correctly after loading from the API', async ({ page, request }) => {
    const registration = await request.post(`${apiUrl}/users`, { data: user })
    expect(registration.status()).toBe(201)
    const login = await request.post(`${apiUrl}/users/auth`, {
      data: { email: user.email, password: user.password }
    })
    expect(login.status()).toBe(200)
    const token = await login.json()
    const headers = { Authorization: `Bearer ${token}` }
    let recipeId

    try {
      const creation = await request.post(`${apiUrl}/recipes`, {
        headers, data: { title: `E2E recipe ${user.username}` }
      })
      expect(creation.status()).toBe(201)
      recipeId = await creation.json()
      const favorite = await request.patch(`${apiUrl}/users/favorites/${recipeId}`, { headers })
      expect(favorite.status()).toBe(200)

      await page.goto('/landing')
      await page.evaluate(value => { sessionStorage.token = value }, token)
      await page.goto('/my-recipes')
      const star = page.getByRole('button', { name: 'Añadir a recetas favoritas' }).locator('svg')
      await expect(star).toHaveCSS('opacity', '1')
      const update = page.waitForResponse(response =>
        response.url() === `${apiUrl}/users/favorites/${recipeId}` && response.request().method() === 'PATCH'
      )
      await page.getByRole('button', { name: 'Añadir a recetas favoritas' }).click()
      expect((await update).status()).toBe(200)
      await expect(page.getByText('Receta eliminada de favoritos')).toBeVisible()
      await page.getByRole('button', { name: 'Aceptar' }).click()
      await page.reload()
      await expect(star).toHaveCSS('opacity', '0.3')
    } finally {
      if (recipeId) {
        const deletion = await request.delete(`${apiUrl}/recipes/${recipeId}`, { headers })
        expect(deletion.status()).toBe(204)
      }
    }
  })

  test('keeps the session when loading a recipe fails on the server', async ({ page }) => {
    const recipeId = 'aaaaaaaaaaaaaaaaaaaaaaaa'
    await page.route(`${apiUrl}/recipes/${recipeId}`, route => route.fulfill({
      status: 500,
      json: { error: 'SystemError', message: 'internal server error' }
    }))
    await page.goto('/landing')
    await page.evaluate(() => { sessionStorage.token = 'test-token' })

    await page.goto(`/recipe/${recipeId}`)

    await expect(page.getByText('Error al cargar la receta')).toBeVisible()
    await expect(page).toHaveURL(new RegExp(`/recipe/${recipeId}$`))
    expect(await page.evaluate(() => sessionStorage.getItem('token'))).toBe('test-token')
  })

  test('signs out if the recipe refresh after a favorite change returns 401', async ({ page }) => {
    const recipeId = 'aaaaaaaaaaaaaaaaaaaaaaaa'
    let reads = 0
    await page.route(`${apiUrl}/recipes/${recipeId}`, route => {
      reads++
      return reads === 1
        ? route.fulfill({ json: {
          id: recipeId, title: 'Test recipe', author: { username: 'testuser' },
          date: '2026-01-01', images: [], tags: [], ingredients: [], steps: [], isFavorite: false
        } })
        : route.fulfill({ status: 401, json: { error: 'CredentialsError', message: 'invalid credentials' } })
    })
    await page.route(`${apiUrl}/users/favorites/${recipeId}`, route => route.fulfill({ json: {} }))
    await page.goto('/landing')
    await page.evaluate(() => { sessionStorage.token = 'test-token' })
    await page.goto(`/recipe/${recipeId}`)

    await page.getByRole('button', { name: 'Añadir a favoritos' }).click()

    await expect(page).toHaveURL(/\/login$/)
    await expect(page.getByText('Tu sesión no es válida o ha caducado. Inicia sesión de nuevo.')).toBeVisible()
    expect(await page.evaluate(() => sessionStorage.getItem('token'))).toBeNull()
  })
})
