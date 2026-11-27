import { expect, test } from '@playwright/test';
import { addAndCropPhotos, startHeartCollage } from '../helpers/wizard';
import { tileFiles } from '../helpers/images';

// The server refuses a collage with more photos than it allows (the test stack allows 5; see scripts/run-local.mjs).
// The customer should be told why in plain words and stay where they are, not be left on a spinner or a blank page.
test('too many photos gives a clear message and leaves the customer on the final step', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await startHeartCollage(page);
  await page.getByRole('button', { name: 'Confirm Preview' }).click();
  await addAndCropPhotos(page, tileFiles(6));

  await page.getByRole('button', { name: 'Next Step' }).click();
  await page.getByRole('button', { name: 'Create Collage' }).click();

  // The API's own words for the refusal reach the screen.
  await expect(page.getByText('Too many photos: at most 5 can be used in one collage')).toBeVisible({ timeout: 30_000 });

  // The loading screen is gone and the customer can try again, on the same step; nothing was built.
  await expect(page.getByRole('button', { name: 'Create Collage' })).toBeVisible();
  await expect(page.getByText(/Creating your collage/)).toBeHidden();
  await expect(page).not.toHaveURL(/\/preview\//);

  expect(pageErrors).toEqual([]);
});
