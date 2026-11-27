# End-to-end tests

Browser tests of what a customer does, run with [Playwright](https://playwright.dev) against a real stack: the
production build of this storefront, the Django API, a Celery worker and Redis. They are separate from the unit tests
(`npm test`, Vitest) and have their own `package.json`, so the app does not depend on them.

## What is covered

| Test | What it proves |
| --- | --- |
| `tests/symbol-preview.e2e.ts` | A symbol collage reaches its light/dark preview, so the page and the API agree on the grid. |
| `tests/refused-request.e2e.ts` | When the server refuses a collage (too many photos), the customer sees the API's own plain-words message, the loading screen goes away, they stay on the final step, and nothing is built. |
| `tests/photo-collage.e2e.ts` | A customer adds six photos, crops each one, and the server builds the collage (a real Celery task) until the watermarked preview and the Place Order and Download buttons appear. This is the test for the broken photo step that went unnoticed on the live site in November 2026. |

Not covered yet (planned in bsav0016/collageCreationsBackend#129): checkout with Stripe test mode and the admin order
list. The busy (503) and too-many-requests (429) messages are covered by unit tests but not yet in a browser. Nothing here pays, creates an order or sends an email.

## Running them

You need Node 22, Python 3.12 with the backend's requirements installed, a checkout of
[collageCreationsBackend](https://github.com/bsav0016/collageCreationsBackend), and Docker (for Redis).

```bash
# once
cd e2e && npm ci && npx playwright install chromium
cp ../../collageCreationsBackend/CollageCreation/collagecreation.env.example ../../collageCreationsBackend/CollageCreation/collagecreation.env
docker run -d --name cc-e2e-redis -p 6379:6379 redis:7-alpine

# every time
BACKEND_DIR=../../collageCreationsBackend PYTHON=../../collageCreationsBackend/venv/bin/python npm run local
```

`npm run local` (`scripts/run-local.mjs`) migrates the database, starts the API on :8000 and one Celery worker,
builds the storefront and serves the build on :4000, runs the tests, and stops everything. It starts the API with
`MAX_COLLAGE_TILES=5` (the most photos a collage may use there), so the refusal test needs only six photos and the photo test
uses five. Arguments after it go to
Playwright, for example `npm run local -- --headed` or `npm run local -- tests/photo-collage.e2e.ts`. Set
`E2E_VERBOSE=1` to see the servers' output. A failed run keeps a trace, a video and a screenshot in `results/` and an
HTML report in `report/` (`npx playwright show-report report`).

Notes:

- **Leave `REDIS_URL` unset in the backend's env file.** The backend's cache settings pass an SSL option meant for
  production's TLS Redis URL, which a plain `redis://` URL rejects. Without it Celery uses `localhost:6379` and Django
  uses an in-process cache, which is what these tests want.
- The tests run against a production build on purpose. The Vite dev server behaves differently from the build that
  customers get, and the broken photo step only showed up in the build.
- Selectors use roles and visible text (the storefront has no `data-testid` attributes). If a label changes, update the
  test with it.
- Test images are generated in memory (`helpers/images.ts`), so no image files are stored in the repository.

## Pointing the tests at another server

`APP_URL` is the storefront the browser opens (default `http://localhost:4000`). To run the tests with Playwright
directly against servers you started yourself: `APP_URL=http://localhost:4000 npx playwright test`. Do not point them at
production: the photo test builds a real collage on the server it talks to.
