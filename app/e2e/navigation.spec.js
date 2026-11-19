import { randomUUID } from 'node:crypto'
import { expect, test } from '@playwright/test'
import { removeE2eUser } from '../../api/test/e2eDatabase.js'

const apiUrl = 'http://127.0.0.1:32123'

test.describe('navigation', () => {
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

  test('Menu → Mis recetas: click en "Mis recetas" navega a /my-recipes', async ({ page, request }) => {
    const response = await request.post(`${apiUrl}/users`, { data: user })
    expect(response.status()).toBe(201)

    await page.goto('/login')
    await page.getByLabel('Email').fill(user.email)
    await page.getByLabel('Contraseña', { exact: true }).fill(user.password)
    await page.getByRole('button', { name: 'Inicio' }).click()
    await expect(page).toHaveURL(/\/menu$/)

    await page.route(`${apiUrl}/recipes/my-recipes`, route => route.fulfill({ json: [] }))

    await page.getByRole('link', { name: 'Mis recetas' }).click()
    await expect(page).toHaveURL(/\/my-recipes$/)
  })

  test('Menu → Descubre: click en "Descubre" navega a /discover', async ({ page, request }) => {
    const response = await request.post(`${apiUrl}/users`, { data: user })
    expect(response.status()).toBe(201)

    await page.goto('/login')
    await page.getByLabel('Email').fill(user.email)
    await page.getByLabel('Contraseña', { exact: true }).fill(user.password)
    await page.getByRole('button', { name: 'Inicio' }).click()
    await expect(page).toHaveURL(/\/menu$/)

    await page.route(`${apiUrl}/recipes/published-recipes`, route => route.fulfill({ json: [] }))

    await page.getByRole('link', { name: 'Descubre' }).click()
    await expect(page).toHaveURL(/\/discover$/)
  })

  test('Menu → Favoritas: click en "Las favoritas" navega a /favorites', async ({ page, request }) => {
    const response = await request.post(`${apiUrl}/users`, { data: user })
    expect(response.status()).toBe(201)

    await page.goto('/login')
    await page.getByLabel('Email').fill(user.email)
    await page.getByLabel('Contraseña', { exact: true }).fill(user.password)
    await page.getByRole('button', { name: 'Inicio' }).click()
    await expect(page).toHaveURL(/\/menu$/)

    await page.route(`${apiUrl}/recipes/favorites-recipes`, route => route.fulfill({ json: [] }))

    await page.getByRole('link', { name: 'Las favoritas' }).click()
    await expect(page).toHaveURL(/\/favorites$/)
  })

  test('Logo → Menú desde MyRecipes: click en el logo navega a /menu', async ({ page, request }) => {
    const response = await request.post(`${apiUrl}/users`, { data: user })
    expect(response.status()).toBe(201)

    await page.goto('/login')
    await page.getByLabel('Email').fill(user.email)
    await page.getByLabel('Contraseña', { exact: true }).fill(user.password)
    await page.getByRole('button', { name: 'Inicio' }).click()
    await expect(page).toHaveURL(/\/menu$/)

    await page.route(`${apiUrl}/recipes/my-recipes`, route => route.fulfill({ json: [] }))
    await page.getByRole('link', { name: 'Mis recetas' }).click()
    await expect(page).toHaveURL(/\/my-recipes$/)

    await page.getByRole('link', { name: 'Ir al menú' }).click()
    await expect(page).toHaveURL(/\/menu$/)
  })

  test('Logo → Menú desde Discover: click en el logo navega a /menu', async ({ page, request }) => {
    const response = await request.post(`${apiUrl}/users`, { data: user })
    expect(response.status()).toBe(201)

    await page.goto('/login')
    await page.getByLabel('Email').fill(user.email)
    await page.getByLabel('Contraseña', { exact: true }).fill(user.password)
    await page.getByRole('button', { name: 'Inicio' }).click()
    await expect(page).toHaveURL(/\/menu$/)

    await page.route(`${apiUrl}/recipes/published-recipes`, route => route.fulfill({ json: [] }))
    await page.getByRole('link', { name: 'Descubre' }).click()
    await expect(page).toHaveURL(/\/discover$/)

    await page.getByRole('link', { name: 'Ir al menú' }).click()
    await expect(page).toHaveURL(/\/menu$/)
  })

  test('Logo → Menú desde Favorites: click en el logo navega a /menu', async ({ page, request }) => {
    const response = await request.post(`${apiUrl}/users`, { data: user })
    expect(response.status()).toBe(201)

    await page.goto('/login')
    await page.getByLabel('Email').fill(user.email)
    await page.getByLabel('Contraseña', { exact: true }).fill(user.password)
    await page.getByRole('button', { name: 'Inicio' }).click()
    await expect(page).toHaveURL(/\/menu$/)

    await page.route(`${apiUrl}/recipes/favorites-recipes`, route => route.fulfill({ json: [] }))
    await page.getByRole('link', { name: 'Las favoritas' }).click()
    await expect(page).toHaveURL(/\/favorites$/)

    await page.getByRole('link', { name: 'Ir al menú' }).click()
    await expect(page).toHaveURL(/\/menu$/)
  })

  test('Landing → Login: click en "Inicio" navega a /login', async ({ page }) => {
    await page.goto('/landing')
    await expect(page.getByText('Cook & Cool')).toBeVisible()

    await page.getByRole('link', { name: 'Inicio' }).click()
    await expect(page).toHaveURL(/\/login$/)
  })

  test('Landing → Registro: click en "Registro" navega a /register', async ({ page }) => {
    await page.goto('/landing')
    await expect(page.getByText('Cook & Cool')).toBeVisible()

    await page.getByRole('link', { name: 'Registro' }).click()
    await expect(page).toHaveURL(/\/register$/)
  })

  test('Redirección /menu sin sesión: ir a /menu sin token redirige a /login', async ({ page }) => {
    await page.goto('/menu')
    await expect(page).toHaveURL(/\/login$/)
  })

  test('Crear receta desde menú: click en "Nueva receta" navega a /create-recipe/:id', async ({ page, request }) => {
    const response = await request.post(`${apiUrl}/users`, { data: user })
    expect(response.status()).toBe(201)

    await page.goto('/login')
    await page.getByLabel('Email').fill(user.email)
    await page.getByLabel('Contraseña', { exact: true }).fill(user.password)
    await page.getByRole('button', { name: 'Inicio' }).click()
    await expect(page).toHaveURL(/\/menu$/)

    await page.getByRole('button', { name: 'Nueva receta' }).click()
    await expect(page).toHaveURL(/\/create-recipe\/.+/)
  })
})
