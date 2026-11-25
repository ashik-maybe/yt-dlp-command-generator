import { expect, test } from '@playwright/test'

test.describe('keyboard flow', () => {
  test('tabs to an outcome, selects it, and shows command text', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const outcome = page.getByRole('button', { name: /List formats/i }).first()
    await expect(outcome).toBeVisible()

    for (let i = 0; i < 40; i += 1) {
      await page.keyboard.press('Tab')
      const focused = await outcome.evaluate((el) => el === document.activeElement)
      if (focused) break
    }

    await expect(outcome).toBeFocused()
    await page.keyboard.press('Enter')

    const command = page.locator('pre code').first()
    await expect(command).toBeVisible()
    await expect(command).not.toBeEmpty()
    await page.screenshot({ path: 'tests/e2e/screenshots/keyboard-flow.png', fullPage: true })
  })
})
