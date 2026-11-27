import { expect, test } from '@playwright/test';
import { ADMIN_PASSWORD, expectOrdersPage, signInAsAdmin } from '../helpers/admin';

// The staff side of the shop: sign in and find a paid order. The account and the order are made by the backend's
// `seed_e2e_data` command (see scripts/run-local.mjs), because the browser tests never pay for anything.
test.describe('the admin panel', () => {
  test('a wrong password is refused and keeps the person on the login page', async ({ page }) => {
    await signInAsAdmin(page, `${ADMIN_PASSWORD}-wrong`);
    await expect(page.getByText('Invalid username/password')).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page.getByText('Unactioned Orders')).toHaveCount(0);
  });

  test('signing in lists the new order, and opening it shows who ordered', async ({ page }) => {
    await signInAsAdmin(page);
    await expectOrdersPage(page);

    // A paid order nobody has acted on yet waits under "Unactioned Orders" (the page above shows that group).
    const order = page.getByText(/^Order \d+$/).first();
    await expect(order).toBeVisible();
    await order.click();

    await expect(page).toHaveURL(/\/admin\/admin-order\/\d+/);
    await expect(page.getByText(/^Order Number: \d+$/)).toBeVisible();
    await expect(page.getByLabel('First Name')).toHaveValue('Ada');
    await expect(page.getByLabel('Last Name')).toHaveValue('Tester');
    await expect(page.getByLabel('Email')).toHaveValue('e2e-customer@example.com');
  });

  test('the orders page without signing in sends the person to the login page', async ({ page }) => {
    await page.goto('/admin/admin-orders');
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page.getByRole('heading', { name: 'Admin Login' })).toBeVisible();
  });
});
