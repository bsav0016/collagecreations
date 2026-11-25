import { expect, type Page } from '@playwright/test';

// The staff account made by `manage.py seed_e2e_data` in the backend (a throwaway value for a throwaway database).
export const ADMIN_USERNAME = 'e2e-admin';
export const ADMIN_PASSWORD = 'e2e-admin-password';

export async function signInAsAdmin(page: Page, password = ADMIN_PASSWORD) {
  await page.goto('/admin/login');
  await page.locator('#username').fill(ADMIN_USERNAME);
  await page.locator('#password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
}

/** The orders page is showing (its order groups only load for a signed-in staff user). */
export async function expectOrdersPage(page: Page) {
  await expect(page).toHaveURL(/\/admin\/admin-orders/);
  await expect(page.getByText('Unactioned Orders')).toBeVisible();
}
