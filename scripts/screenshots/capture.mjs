// Regenerates the images in docs/screenshots/ from a running local copy of the app.
//
//   npm run dev                       (in the repo root: http://localhost:4000)
//   cd scripts/screenshots && npm ci && npx playwright install chromium
//   npm run capture
//
// The wizard screens (size, photo size, preview) need no sign-in. The preview screen
// needs the backend API (localhost:8000) to turn the heart symbol into a grid.
// Set APP_URL to capture a different server. Nothing here uses real accounts or data.
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const APP_URL = (process.env.APP_URL || 'http://localhost:4000').replace(/\/$/, '');
const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../docs/screenshots');
const VIEWPORT = { width: 1440, height: 900 };

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: VIEWPORT, colorScheme: 'light' })).newPage();

async function settle() {
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: '*{animation:none!important;transition:none!important;caret-color:transparent!important}' });
  await page.waitForTimeout(300);
}

async function shot(name, options = {}) {
  await settle();
  await page.screenshot({ path: path.join(OUT, `${name}.png`), ...options });
  console.log(`wrote docs/screenshots/${name}.png`);
}

// Home page. The fixed-height viewport shows the hero and the start of the collage-type cards.
await page.goto(`${APP_URL}/`);
await page.getByRole('heading', { name: /Turn Hundreds of/ }).waitFor();
await page.getByText('Choose Your Collage Type').scrollIntoViewIfNeeded();
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(800); // card reveal animation
await shot('home');

// Wizard, text flow (offers the most print sizes): type -> size -> text -> photo size.
await page.goto(`${APP_URL}/collage/1`);
await page.getByRole('button', { name: 'Select' }).nth(2).click();        // cards are Symbol, Image, Text
await page.getByRole('heading', { name: 'Select Output Size' }).waitFor();
await page.getByText(/^12\s*[×x]\s*12/).first().click();
await page.getByRole('button', { name: 'Continue' }).waitFor();           // appears with the scale comparison
await shot('order-size');

await page.getByRole('button', { name: 'Continue' }).click();
await page.getByPlaceholder('Enter text').fill('Family');
await page.getByRole('button', { name: 'Next Step' }).click();
await page.getByRole('heading', { name: /Select Small Image Sizes/ }).waitFor();
await shot('photo-size');

// Wizard, symbol flow: type -> size -> heart -> photo size -> light/dark preview.
await page.goto(`${APP_URL}/collage/1`);
await page.getByRole('button', { name: 'Select' }).first().click();
await page.getByText(/^24\s*[×x]\s*24/).first().click();
await page.getByRole('button', { name: 'Continue' }).click();
await page.locator('#symbolSelect').selectOption('Heart');
await page.getByRole('button', { name: 'Yes' }).click();
await page.getByText('Medium', { exact: true }).click();
await page.getByRole('heading', { name: /Light \/ Dark Image Preview/ }).waitFor({ timeout: 60000 });
await page.getByRole('button', { name: 'Confirm Preview' }).waitFor();
await page.waitForTimeout(1500); // let the grid finish drawing
await shot('light-dark-preview', { fullPage: true });

await browser.close();
