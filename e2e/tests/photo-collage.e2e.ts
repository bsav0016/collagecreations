import { expect, test } from '@playwright/test';
import { startHeartCollage } from '../helpers/wizard';
import { tileFiles } from '../helpers/images';

// The core of the product: add photos, crop each one, and have the server build the collage (a real Celery task, with
// progress shown on the page) until the watermarked preview and the order buttons appear. A broken photo step once went
// unnoticed on the live site for weeks (the crop screen's "Next photo" did nothing), and this is the test for it.
test('a customer adds photos, crops them and gets a collage preview', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await startHeartCollage(page);
  await page.getByRole('button', { name: 'Confirm Preview' }).click();

  const tiles = tileFiles(6);
  await page.locator('input[type=file]').first().setInputFiles(tiles);

  // The crop screen steps through the photos one at a time.
  for (let photo = 1; photo < tiles.length; photo++) {
    await expect(page.getByText(`Photo ${photo} of ${tiles.length}`)).toBeVisible();
    await page.getByRole('button', { name: 'Next photo' }).click();
  }
  await expect(page.getByText(`Photo ${tiles.length} of ${tiles.length}`)).toBeVisible();
  await page.getByRole('button', { name: 'Finish' }).click();

  await page.getByRole('button', { name: 'Next Step' }).click();
  await page.getByRole('button', { name: 'Create Collage' }).click();

  // The preview page: the finished (watermarked) collage and the two ways to buy it.
  await expect(page).toHaveURL(/\/preview\//, { timeout: 120_000 });
  await expect(page.getByRole('heading', { name: 'Collage Preview' })).toBeVisible();
  await expect(page.getByRole('button', { name: /^Place Order/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /^Download/ })).toBeVisible();
  await expect(page.getByText(/Your collage is saved until/)).toBeVisible();

  expect(pageErrors).toEqual([]);
});
