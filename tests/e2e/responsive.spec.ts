import { expect, test } from '@playwright/test'

const widths = [1440, 1024, 820, 768, 390, 320]

test.describe('responsive layout', () => {
  for (const width of widths) {
    test(`no horizontal page scroll at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      await page.screenshot({
        path: `tests/e2e/screenshots/width-${width}.png`,
        fullPage: true,
      })

      const hasHorizontalScroll = await page.evaluate(() => {
        const el = document.documentElement
        return el.scrollWidth > el.clientWidth
      })

      expect(hasHorizontalScroll).toBe(false)
    })
  }
})

test('selects the recipe from a deep link', async ({ page }) => {
  await page.goto('/?recipeId=playlist-range&shell=posix')
  await page.waitForLoadState('networkidle')

  await expect(page.getByText(/Playlist range recipe/)).toBeVisible()
})

test('back changes the URL after a state change', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  const initialSearch = await page.evaluate(() => window.location.search)

  const field = page.getByLabel('Source URL')
  await expect(field).toBeVisible()
  await field.fill('https://example.com/video-1')
  await page.waitForFunction((before) => window.location.search !== before, initialSearch)
  const changedSearch = await page.evaluate(() => window.location.search)
  expect(changedSearch).not.toBe(initialSearch)

  await page.goBack()
  await page.waitForFunction((changed) => window.location.search !== changed, changedSearch)
  expect(await page.evaluate(() => window.location.search)).not.toBe(changedSearch)
})
