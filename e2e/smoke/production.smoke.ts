import { expect, test } from '@playwright/test';
import { addAndCropPhotos, startHeartCollage } from '../helpers/wizard';
import { tileFiles } from '../helpers/images';

// A narrow, read-only check of the live site after a deploy. It does what a customer does up to the point where
// anything would be kept, and stops there:
//   - the API is healthy (and, after a backend deploy, is running the commit that was just deployed);
//   - the storefront loads with no script errors;
//   - the order wizard works through choosing a symbol and its grid preview (one cheap request, nothing stored) and
//     through adding photos and cropping them, which happens entirely in the browser.
// It never presses Create Collage (that queues work for the single worker and stores images), never places an order,
// never pays and never signs in. The headless browser is recognised as a bot, so the visitor counter ignores it.
const API = process.env.SMOKE_API_URL || 'https://api.collagecreations.org';

test('the API is healthy and runs the commit that was just deployed', async ({ request }) => {
  const response = await request.get(`${API}/api/health/`);
  expect(response.status()).toBe(200);
  const health = await response.json();
  expect(health.status).toBe('ok');
  expect(health.checks).toEqual({ database: 'ok', cache: 'ok' });

  // Set by the backend's smoke workflow to the commit its deploy just shipped. Not checked for a storefront deploy.
  const expected = process.env.EXPECT_RELEASE_SHA;
  if (expected) {
    expect(health.release === expected || expected.startsWith(health.release) || health.release.startsWith(expected)).toBe(true);
  }
});

test('the storefront loads and a customer can get through the wizard to the end of the crop step', async ({ page }) => {
  const pageErrors: string[] = [];
  const serverErrors: string[] = [];
  let throttled = false;
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('response', (response) => {
    if (!response.url().startsWith(API)) return;
    if (response.status() === 429) throttled = true;
    else if (response.status() >= 500) serverErrors.push(`${response.status()} ${response.url()}`);
  });

  await page.goto('/');
  await expect(page.getByRole('menuitem', { name: 'Helpful Tips' })).toBeVisible();

  try {
    await startHeartCollage(page);
    await page.getByRole('button', { name: 'Confirm Preview' }).click();
    await addAndCropPhotos(page, tileFiles(5));
    // The last button before the collage is built. Not pressed: building is the one step that costs the server.
    await expect(page.getByRole('button', { name: 'Next Step' })).toBeVisible();
  } catch (error) {
    // The preview is limited per address, and a GitHub runner shares its address with others: that is not an outage.
    if (throttled) test.skip(true, 'the API throttled the preview request (429): inconclusive, not a failure');
    throw error;
  }

  expect(serverErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
});
