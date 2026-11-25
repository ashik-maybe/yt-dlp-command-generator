import { expect, test } from '@playwright/test'

test('selects a grouped high-value outcome and shows the expected flag', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /List formats/i }).first().click()

  const command = page.locator('pre code').first()
  await expect(command).toBeVisible()
  await expect(command).toContainText('--list-formats')
})

test('inserts a raw snippet from the advanced drawer into the command', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Advanced' }).click()

  const dialog = page.getByRole('dialog', { name: 'Advanced options' })
  await expect(dialog).toBeVisible()
  await dialog.getByRole('button', { name: /Match filters \(regex\)/i }).click()

  await expect(dialog.getByLabel('Raw arguments')).toHaveValue('--match-filters "!is_live"')
})
