import { expect, test, type Page, type Route } from '@playwright/test';
import { addAndCropPhotos, startHeartCollage } from '../helpers/wizard';
import { tileFiles } from '../helpers/images';

// What a customer sees when the server says "not now": 429 (too many requests from this address) and 503 (the collage
// worker is busy), both with a Retry-After. The two refusals are sent at the HTTP boundary with exactly the shapes the
// API produces (DRF's throttle answer, and the backpressure answer in api/views.py), because making the real server
// refuse needs hundreds of requests or a deliberately full queue. The server's side of that is tested in the backend
// (api/test_build_throttles.py, api/test_backpressure.py); this tests the page's side of the same contract. Both answers
// expose Retry-After to the page, as the API does (CORS_EXPOSE_HEADERS, backend PR "Let the storefront read Retry-After").
const COLLAGE_URL = '**/api/collage/';

const throttled = (seconds: number) => ({
  status: 429,
  headers: { 'Retry-After': String(seconds), 'Access-Control-Allow-Origin': '*', 'Access-Control-Expose-Headers': 'Retry-After' },
  contentType: 'application/json',
  body: JSON.stringify({ detail: `Request was throttled. Expected available in ${seconds} seconds.` }),
});

const busy = (seconds: number) => ({
  status: 503,
  headers: { 'Retry-After': String(seconds), 'Access-Control-Allow-Origin': '*', 'Access-Control-Expose-Headers': 'Retry-After' },
  contentType: 'application/json',
  body: JSON.stringify({ error: 'We are very busy right now. Please try again in a couple of minutes.', retry_after: seconds }),
});

/** Only the real POST is answered; the browser's CORS preflight (OPTIONS) goes to the real API as usual. */
const answerPost = (page: Page, handler: (route: Route, attempt: number) => Promise<void>) => {
  let attempt = 0;
  return page.route(COLLAGE_URL, async (route) => {
    if (route.request().method() !== 'POST') return route.continue();
    attempt += 1;
    await handler(route, attempt);
  });
};

async function reachCreateCollage(page: Page) {
  await startHeartCollage(page);
  await page.getByRole('button', { name: 'Confirm Preview' }).click();
  await addAndCropPhotos(page, tileFiles(5));
  await page.getByRole('button', { name: 'Next Step' }).click();
}

test.describe('a refused collage request', () => {
  test('too many requests says how long to wait and leaves the customer on the final step', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    await answerPost(page, (route) => route.fulfill(throttled(1800)));

    await reachCreateCollage(page);
    await page.getByRole('button', { name: 'Create Collage' }).click();

    await expect(page.getByText("You're going a little fast. Please wait about 30 minutes and try again.")).toBeVisible({ timeout: 30_000 });
    await expect(page.getByRole('button', { name: 'Create Collage' })).toBeVisible();
    await expect(page.getByText(/Creating your collage/)).toBeHidden();
    await expect(page).not.toHaveURL(/\/preview\//);
    expect(pageErrors).toEqual([]);
  });

  test('a busy worker with a long wait gives up at once and says how long', async ({ page }) => {
    await answerPost(page, (route) => route.fulfill(busy(600)));

    await reachCreateCollage(page);
    await page.getByRole('button', { name: 'Create Collage' }).click();

    // 10 minutes is more than the page will wait by itself (3 minutes), so it does not keep retrying.
    await expect(page.getByText("We're very busy right now. Please try again in about 10 minutes.")).toBeVisible({ timeout: 30_000 });
    await expect(page.getByRole('button', { name: 'Create Collage' })).toBeVisible();
    await expect(page).not.toHaveURL(/\/preview\//);
  });

  test('a busy worker with a short wait tells the customer, waits, and then builds the collage', async ({ page }) => {
    // The first try is refused with a 5 second wait; the second goes through to the real API and Celery worker.
    await answerPost(page, (route, attempt) => (attempt === 1 ? route.fulfill(busy(5)) : route.continue()));

    await reachCreateCollage(page);
    await page.getByRole('button', { name: 'Create Collage' }).click();

    await expect(page.getByText(/We're very busy right now, so your collage is waiting its turn\. Trying again in about 5 seconds/))
      .toBeVisible({ timeout: 30_000 });
    await expect(page).toHaveURL(/\/preview\//, { timeout: 120_000 });
    await expect(page.getByRole('heading', { name: 'Collage Preview' })).toBeVisible();
  });
});
