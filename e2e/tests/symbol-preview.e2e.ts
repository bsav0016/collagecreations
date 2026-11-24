import { expect, test } from '@playwright/test';
import { startHeartCollage } from '../helpers/wizard';

// A customer makes a symbol collage as far as its light/dark preview. The grid comes from the API, so this fails if the
// frontend and the backend no longer agree.
test('a symbol collage reaches its preview', async ({ page }) => {
  await startHeartCollage(page);
  await expect(page.getByRole('button', { name: 'Confirm Preview' })).toBeVisible();
});
