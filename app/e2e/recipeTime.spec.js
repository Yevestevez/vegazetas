import { expect, test } from '@playwright/test'

const recipeId = 'aaaaaaaaaaaaaaaaaaaaaaaa'
const recipeUrl = `http://127.0.0.1:32123/recipes/${recipeId}`

test.describe('optional recipe time', () => {
  let recipe
  let updates

  test.beforeEach(async ({ page }) => {
    recipe = { id: recipeId, title: 'Test recipe', author: { username: 'testuser' }, difficulty: 'easy', date: '2026-01-01', images: [], tags: [], ingredients: [], steps: [] }
    updates = []
    await page.addInitScript(() => { sessionStorage.token = 'test-token' })
    await page.route(recipeUrl, async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({ json: recipe })
      } else if (route.request().method() === 'PATCH') {
        const body = route.request().postDataJSON()
        updates.push(body)
        recipe = { ...recipe, ...body }
        if (!Object.hasOwn(body, 'time')) delete recipe.time
        await route.fulfill({ status: 204 })
      } else {
        await route.abort()
      }
    })
  })

  for (const time of [undefined, 0]) {
    test(`shows an empty time field for ${time === 0 ? 'legacy zero' : 'absent time'}`, async ({ page }) => {
      if (time !== undefined) recipe.time = time
      await page.goto(`/update-recipe/${recipeId}`)

      await expect(page.getByLabel('Tiempo (min)')).toHaveValue('')
      await page.getByRole('region', { name: 'Datos básicos' }).getByRole('button', { name: 'Guardar' }).click()
      await expect(page.getByText('No hay cambios que guardar')).toBeVisible()
      expect(updates).toHaveLength(0)
    })
  }

  test('clears and then sets time, preserving each value after reload', async ({ page }) => {
    recipe.time = 30
    await page.goto(`/update-recipe/${recipeId}`)
    const time = page.getByLabel('Tiempo (min)')
    await expect(time).toHaveValue('30')

    await time.clear()
    await page.getByRole('region', { name: 'Datos básicos' }).getByRole('button', { name: 'Guardar' }).click()
    await expect(page.getByText('Receta actualizada')).toBeVisible()
    expect(updates[0]).not.toHaveProperty('time')
    await page.reload()
    await expect(time).toHaveValue('')

    await time.fill('17')
    await page.getByRole('region', { name: 'Datos básicos' }).getByRole('button', { name: 'Guardar' }).click()
    await expect(page.getByText('Receta actualizada')).toBeVisible()
    expect(updates[1].time).toBe(17)
    await page.reload()
    await expect(time).toHaveValue('17')
  })

  test('does not render a legacy zero alongside difficulty', async ({ page }) => {
    recipe.time = 0
    await page.goto(`/recipe/${recipeId}`)

    await expect(page.getByText('Dificultad: fácil')).toBeVisible()
    await expect(page.getByText('0', { exact: true })).toHaveCount(0)
    await expect(page.getByText('0 min')).toHaveCount(0)
  })
})
