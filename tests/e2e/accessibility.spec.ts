import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test.describe('accessibility', () => {
  test('axe on empty state', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.screenshot({ path: 'tests/e2e/screenshots/empty-state.png', fullPage: true })

    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations).toEqual([])
  })

  test('axe on filled state', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const outcome = page.getByRole('button', { name: /List formats/i }).first()
    await expect(outcome).toBeVisible()
    await outcome.click()

    const command = page.locator('pre code').first()
    await expect(command).toBeVisible()
    await page.screenshot({ path: 'tests/e2e/screenshots/filled-state.png', fullPage: true })

    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations).toEqual([])
  })
})
