import { expect, type Page } from '@playwright/test';

// Stripe's published test cards: https://docs.stripe.com/testing
export const CARD_OK = '4242424242424242';
export const CARD_DECLINED = '4000000000000002';

export const customer = { firstname: 'Ada', lastname: 'Tester', email: 'ada.tester@example.com', zip: '96818' };

/** Fills the download form and goes to billing: the server works out the tax and the card form appears. */
export async function fillDownloadFormAndGoToBilling(page: Page) {
  await page.locator('#firstname').fill(customer.firstname);
  await page.locator('#lastname').fill(customer.lastname);
  await page.locator('#email').fill(customer.email);
  await page.locator('#zipCode').fill(customer.zip);
  await page.getByRole('button', { name: 'Go To Billing' }).click();
  await expect(page.getByText('Total Cost')).toBeVisible();
}

/** Types a card into Stripe's card field (a Stripe-hosted iframe), expiry far in the future. */
export async function enterCard(page: Page, number: string) {
  const card = page.frameLocator('iframe[name^="__privateStripeFrame"]').first();
  await card.locator('[name="cardnumber"]').fill(number);
  await card.locator('[name="exp-date"]').fill('1234');
  await card.locator('[name="cvc"]').fill('123');
  // The card field also asks for a postal code in some configurations.
  const postal = card.locator('[name="postal"]');
  if (await postal.count()) await postal.fill('96818');
}

/** Records what the API said to each payment request, so a failed checkout shows why (status and body) in the report. */
export function watchPayments(page: Page) {
  const seen: string[] = [];
  page.on('response', async (response) => {
    if (!/\/api\/payment\//.test(response.url())) return;
    let body = '';
    try { body = (await response.text()).slice(0, 500); } catch { /* the page moved on */ }
    seen.push(`${response.status()} ${body}`);
  });
  page.on('requestfailed', (request) => {
    if (//api/payment//.test(request.url())) seen.push(`request failed: ${request.failure()?.errorText}`);
  });
  page.on('console', (message) => {
    if (message.type() === 'error') seen.push(`console error: ${message.text().slice(0, 300)}`);
  });
  return seen;
}

/** Runs an assertion; if it fails, the error also says what the API answered to the payment requests. */
export async function explainingPayments(payments: string[], assertion: () => Promise<unknown>) {
  try {
    await assertion();
  } catch (error) {
    throw new Error(`${(error as Error).message}\n\nAPI payment responses: ${JSON.stringify(payments)}`);
  }
}
