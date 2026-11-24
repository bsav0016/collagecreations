import { expect, type Page } from '@playwright/test';

// The first steps of the wizard, shared by the journeys: a 24 x 24 heart symbol collage up to its light/dark preview.
export async function startHeartCollage(page: Page) {
  await page.goto('/collage/1');
  await page.getByRole('button', { name: 'Select' }).first().click(); // cards are Symbol, Image, Text
  await expect(page.getByRole('heading', { name: 'Select Output Size' })).toBeVisible();

  await page.getByText(/^24\s*[×x]\s*24/).first().click();
  await page.getByRole('button', { name: 'Continue' }).click();

  await page.locator('#symbolSelect').selectOption('Heart');
  await page.getByRole('button', { name: 'Yes' }).click();
  await page.getByText('Medium', { exact: true }).click();

  // The server builds the grid for the symbol: a real request to the API.
  await expect(page.getByRole('heading', { name: /Light \/ Dark Image Preview/ })).toBeVisible({ timeout: 90_000 });
}
