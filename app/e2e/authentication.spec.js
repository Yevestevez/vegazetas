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
})
