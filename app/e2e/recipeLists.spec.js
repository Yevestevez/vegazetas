import { expect, test } from '@playwright/test'

const apiUrl = 'http://127.0.0.1:32123'
const recipeId = 'aaaaaaaaaaaaaaaaaaaaaaaa'
const lists = [
  { path: '/my-recipes', endpoint: 'my-recipes', favorite: false },
  { path: '/discover', endpoint: 'published-recipes', favorite: false },
  { path: '/favorites', endpoint: 'favorites-recipes', favorite: true }
]

for (const list of lists) {
  test.describe(list.path, () => {
    let reads

    test.beforeEach(async ({ page }) => {
      reads = 0
      await page.addInitScript(() => { sessionStorage.token = 'test-token' })
      await page.route('**/*', route => {
        const { origin } = new URL(route.request().url())
        return origin === 'http://127.0.0.1:4173' || origin === apiUrl
          ? route.continue()
          : route.abort()
      })
      await page.route(`${apiUrl}/recipes/${list.endpoint}`, route => {
        reads++
        return route.fulfill({ json: [{
          id: recipeId,
          title: 'Test recipe',
          author: { username: 'testuser' },
          date: '2026-01-01',
          images: [],
          published: true,
          isFavorite: list.favorite
        }] })
      })
    })

    test('loads once and keeps the favorite change when an alert is shown', async ({ page }) => {
      await page.route(`${apiUrl}/users/favorites/${recipeId}`, route => route.fulfill({ json: {} }))
      await page.goto(list.path)
      await expect(page.getByText('Test recipe', { exact: true })).toBeVisible()
      const star = page.getByRole('button', { name: 'Añadir a recetas favoritas' }).locator('svg')
      await expect(star).toHaveCSS('opacity', list.favorite ? '1' : '0.3')

      const update = page.waitForResponse(response =>
        response.url() === `${apiUrl}/users/favorites/${recipeId}` && response.request().method() === 'PATCH'
      )
      await page.getByRole('button', { name: 'Añadir a recetas favoritas' }).click()
      expect((await update).status()).toBe(200)
      await expect(page.getByText(list.favorite ? 'Receta eliminada de favoritos' : 'Receta añadida a favoritos')).toBeVisible()
      await page.getByRole('button', { name: 'Aceptar' }).click()
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))

      await expect(star).toHaveCSS('opacity', list.favorite ? '0.3' : '1')
      expect(reads).toBe(1)
    })

    test('restores favorite state after an update fails without reloading the list', async ({ page }) => {
      await page.route(`${apiUrl}/users/favorites/${recipeId}`, route => route.fulfill({
        status: 500,
        json: { error: 'SystemError', message: 'Favorite update failed' }
      }))
      await page.goto(list.path)
      await expect(page.getByText('Test recipe', { exact: true })).toBeVisible()
      const star = page.getByRole('button', { name: 'Añadir a recetas favoritas' }).locator('svg')

      await page.getByRole('button', { name: 'Añadir a recetas favoritas' }).click()
      await expect(page.getByText('Favorite update failed')).toBeVisible()
      await page.getByRole('button', { name: 'Aceptar' }).click()
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))

      await expect(star).toHaveCSS('opacity', list.favorite ? '1' : '0.3')
      expect(reads).toBe(1)
    })

    test('shows a loading error without retrying when the alert changes', async ({ page }) => {
      await page.route(`${apiUrl}/recipes/${list.endpoint}`, route => {
        reads++
        return route.fulfill({ status: 500, json: { error: 'SystemError', message: 'List loading failed' } })
      })

      await page.goto(list.path)
      await expect(page.getByText('List loading failed')).toBeVisible()
      await page.getByRole('button', { name: 'Aceptar' }).click()
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))

      expect(reads).toBe(1)
    })
  })
}
