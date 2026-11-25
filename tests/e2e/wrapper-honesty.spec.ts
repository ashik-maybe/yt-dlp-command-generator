import { expect, test } from '@playwright/test'

test('page says the web app builds commands only', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText(/builds commands only/i).first()).toBeVisible()
})

test('page makes no execution claim for the web app', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText(/downloads are executed in the browser/i)).toHaveCount(0)
  await expect(page.getByText(/runs? yt-dlp in your browser/i)).toHaveCount(0)
})

test('coverage panel mentions the TUI does the execution', async ({ page }) => {
  await page.goto('/')
  const coverage = page.locator('#coverage')
  await expect(coverage.getByText(/TUI does the execution/i).first()).toBeVisible()
  await expect(coverage.getByText(/Linux only/i).first()).toBeVisible()
  await expect(coverage.getByText(/--run/)).toBeVisible()
  await expect(coverage.getByText(/--yes/)).toBeVisible()
  await expect(coverage.getByText(/--force/)).toBeVisible()
  await expect(coverage.getByText(/--unsafe/)).toBeVisible()
  await expect(coverage.getByText(/Ctrl\+C/)).toBeVisible()
})
