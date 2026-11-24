import { expect, type Page } from '@playwright/test';

// The first steps of the wizard, shared by the journeys: a 24 x 24 heart symbol collage up to its light/dark preview.
/** Adds photos on the "Select Small Images" step and crops each one in turn, until all are added. */
export async function addAndCropPhotos(page: Page, files: { name: string; mimeType: string; buffer: Buffer }[]) {
  await page.locator('input[type=file]').first().setInputFiles(files);
  for (let photo = 1; photo < files.length; photo++) {
    await expect(page.getByText(`Photo ${photo} of ${files.length}`)).toBeVisible();
    await page.getByRole('button', { name: 'Next photo' }).click();
  }
  await expect(page.getByText(`Photo ${files.length} of ${files.length}`)).toBeVisible();
  await page.getByRole('button', { name: 'Finish' }).click();
}

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
