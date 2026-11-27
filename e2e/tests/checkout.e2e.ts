import { expect, test } from '@playwright/test';
import { createHeartCollagePreview } from '../helpers/wizard';
import { tileFiles } from '../helpers/images';
import { CARD_DECLINED, CARD_OK, customer, enterCard, fillDownloadFormAndGoToBilling } from '../helpers/checkout';

// Paying, with Stripe's TEST cards against a Stripe test account (see README.md). Skipped without test keys. The
// download is the cheapest order: no address, no shipping quote.
test.describe('checkout', () => {
  test.skip(!process.env.E2E_STRIPE, 'needs E2E_STRIPE_SECRET_KEY and E2E_STRIPE_PUBLISHABLE_KEY (Stripe test keys)');

  test('a customer pays for a download and gets a confirmation and their file', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    await createHeartCollagePreview(page, tileFiles(5));
    await page.getByRole('button', { name: /^Download/ }).click();
    await expect(page).toHaveURL(/\/download\//);

    await fillDownloadFormAndGoToBilling(page);
    await enterCard(page, CARD_OK);
    await page.getByRole('button', { name: 'Complete Order' }).click();

    // The server authorizes the card, saves the order, then captures the payment.
    await expect(page).toHaveURL(/\/confirmation\//, { timeout: 90_000 });
    await expect(page.getByText('Your order has been placed!')).toBeVisible();
    await expect(page.getByText(/Your order number is: \d+/)).toBeVisible();
    await expect(page.getByText(`A confirmation email has been sent to ${customer.email}.`)).toBeVisible();

    // A paid download comes with an access link to the full-size file.
    await page.getByRole('button', { name: 'Download Your Image' }).click();
    await expect(page).toHaveURL(/\/download-access\//);

    expect(pageErrors).toEqual([]);
  });

  test('a declined card shows the reason and no order is placed', async ({ page }) => {
    await createHeartCollagePreview(page, tileFiles(5));
    await page.getByRole('button', { name: /^Download/ }).click();
    await fillDownloadFormAndGoToBilling(page);
    await enterCard(page, CARD_DECLINED);
    await page.getByRole('button', { name: 'Complete Order' }).click();

    await expect(page.getByText(/card was declined/i)).toBeVisible({ timeout: 30_000 });
    await expect(page).not.toHaveURL(/\/confirmation\//);
    // Still on the billing form, ready to try another card.
    await expect(page.getByRole('button', { name: 'Complete Order' })).toBeVisible();
  });
});
