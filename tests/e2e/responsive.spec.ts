import { expect, test } from '@playwright/test'

const widths = [1440, 1024, 820, 768, 390]

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
