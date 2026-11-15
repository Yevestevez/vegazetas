import { randomUUID } from 'node:crypto'
import { expect, test } from '@playwright/test'
import { removeE2eUser } from '../../api/test/e2eDatabase.js'

const apiUrl = 'http://127.0.0.1:32123'

test.describe('password recovery', () => {
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

  test('solicitar recuperación de contraseña desde Login', async ({ page, request }) => {
    const response = await request.post(`${apiUrl}/users`, { data: user })
    expect(response.status()).toBe(201)

    let recoverCalled = false
    await page.route(`${apiUrl}/users/password/recover`, route => {
      recoverCalled = true
      return route.fulfill({ status: 200 })
    })

    await page.goto('/login')
    await expect(page.getByRole('heading', { name: 'INICIO' })).toBeVisible()

    // Click the password recovery link
    await page.getByText('¿Olvidaste tu contraseña?').click()
    await expect(page.getByRole('heading', { name: 'RECUPERA TU CONTRASEÑA' })).toBeVisible()

    // Fill email in the recovery section
    const recoverySection = page.getByRole('heading', { name: 'RECUPERA TU CONTRASEÑA' }).locator('..')
    await recoverySection.locator('input[type="email"]').fill(user.email)
    await recoverySection.getByRole('button', { name: 'Recuperar contraseña' }).click()

    // Confirm dialog appears BEFORE the request is sent
    await expect(page.getByText('¿Quieres cambiar la contraseña?')).toBeVisible()
    await page.getByRole('button', { name: 'Aceptar' }).click()

    // Success message appears after the request completes
    await expect(page.getByText('Te hemos enviado un correo para recuperar tu contraseña')).toBeVisible({ timeout: 10000 })
    await page.getByRole('button', { name: 'Aceptar' }).click()
    expect(recoverCalled).toBe(true)
  })

  test('cancelar recuperación de contraseña no envía petición', async ({ page, request }) => {
    const response = await request.post(`${apiUrl}/users`, { data: user })
    expect(response.status()).toBe(201)

    let recoverCalled = false
    await page.route(`${apiUrl}/users/password/recover`, route => {
      recoverCalled = true
      return route.fulfill({ status: 200 })
    })

    await page.goto('/login')

    // Click the password recovery link
    await page.getByText('¿Olvidaste tu contraseña?').click()
    await expect(page.getByRole('heading', { name: 'RECUPERA TU CONTRASEÑA' })).toBeVisible()

    // Fill email in the recovery section
    const recoverySection = page.getByRole('heading', { name: 'RECUPERA TU CONTRASEÑA' }).locator('..')
    await recoverySection.locator('input[type="email"]').fill(user.email)
    await recoverySection.getByRole('button', { name: 'Recuperar contraseña' }).click()

    // Cancel the confirm dialog
    await expect(page.getByText('¿Quieres cambiar la contraseña?')).toBeVisible()
    await page.getByRole('button', { name: 'Cancelar' }).click()

    // The recovery endpoint should NOT have been called
    expect(recoverCalled).toBe(false)
  })
})
