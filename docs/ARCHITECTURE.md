# Collage Creations architecture

This repository is the storefront: a React single-page app that collects a customer's choices and photos, shows progress and previews, and takes payment. The heavy work (matching photos, pricing, tax, shipping) happens in a separate API that lives in a private repository. This page shows how the two fit together and what the browser does at each step. The diagrams are Mermaid, which GitHub renders in place.

## System overview

```mermaid
flowchart LR
  subgraph Browser["Browser: this repository"]
    SPA["React SPA<br/>wizard, preview, checkout,<br/>my orders, admin"]
  end

  subgraph API["Private backend"]
    DJ["Django REST API"]
    Q["Celery worker<br/>(Redis queue)<br/>photo matching with<br/>OpenCV, NumPy, Pillow"]
    PG[("PostgreSQL<br/>accounts, orders")]
    OBJ[("Object storage<br/>customer images")]
    DJ --> Q
    DJ --> PG
    Q --> OBJ
    DJ --> OBJ
  end

  STRIPE["Stripe"]
  IDP["Google / Microsoft<br/>sign-in"]
  PAGES["GitHub Pages<br/>static hosting"]

  PAGES -. "serves" .-> SPA
  SPA -- "JSON over HTTPS" --> DJ
  SPA -- "card details go<br/>straight to Stripe" --> STRIPE
  DJ -- "charges the payment" --> STRIPE
  SPA -- "sign-in" --> IDP
```

The browser only collects inputs and displays what the API returns. Price, tax, shipping and the collage itself are all computed on the server, so the page cannot show a different amount from the one that is charged.

## Inside the app (`src`)

| Folder | Role |
| --- | --- |
| `pages/Customer` | The customer-facing pages: the collage wizard, preview, order and billing, download, my orders, saved collages, settings, tips, support, sign-in and the legal pages. |
| `pages/Admin` | A small admin area for orders and support tickets. |
| `services/` | One module per backend concern (`createCollage`, `createPreview`, `PaymentService`, `OrderService`, `customerAuthService` and so on). Pages go through these rather than calling the API themselves. |
| `lib/` | The network client and request constants shared by every service. |
| `context/` | Cross-page state: signed-in customer, the order in progress, server constants such as the print resolution, and toasts. |
| `dtos/` | Typed request and response shapes between the app and the API. |
| `components/` | Shared UI, including the touch-friendly crop screen and the card form. |

## Building a collage

The collage can take a while to build, so the browser starts the job and then follows its real progress instead of waiting on one long request.

```mermaid
sequenceDiagram
  participant C as Customer
  participant B as Browser (SPA)
  participant A as API
  participant W as Worker

  C->>B: choose type, size, main image, text or symbol
  B->>A: preview request (api/preview)
  A-->>B: light/dark grid for the shape
  Note over C,B: the customer can flip squares in the preview
  C->>B: upload and crop the small photos
  B->>A: create collage (api/collage)
  A->>W: queue the build
  A-->>B: task id
  loop every 3 seconds, up to 6 minutes
    B->>A: task result (api/task-result)
    A-->>B: 202 pending, with percent done
  end
  W-->>A: finished
  B->>A: task result
  A-->>B: 201 done, watermarked preview
  B-->>C: preview (sign in to save it)
```

Decisions worth noting:

- **Real progress, not a spinner.** The polling loop reports the percentage the worker has reached, so a long build does not look like a frozen page. It gives up with a clear message after about six minutes.
- **Preview first.** A watermarked preview is produced before anyone pays. The full-resolution file is only made for a paid order, and unpaid uploads are deleted by an hourly job.
- **Photos are prepared before upload.** Images are resized in the browser first to keep uploads small on a phone, and cropped photos are registered with the API (`api/resize-image`), which returns a temporary image id and a smaller copy for the page to show.

## Checkout

Card details never reach the API. Stripe.js turns them into a payment method id in the browser, and the API charges that.

```mermaid
sequenceDiagram
  participant C as Customer
  participant B as Browser (SPA)
  participant S as Stripe
  participant A as API

  C->>B: enter shipping details
  B->>A: shipping cost and tax (api/get-shipping-cost, api/get-tax)
  A-->>B: amounts
  opt discount code
    B->>A: apply discount (api/apply-discount)
    A-->>B: new total
  end
  C->>B: enter card
  B->>S: create payment method (Stripe.js)
  S-->>B: payment method id
  B->>A: payment (api/payment) with the method id
  alt bank asks for 3-D Secure
    A-->>B: requires action + client secret
    B->>S: handle next action (Stripe.js challenge)
    S-->>B: payment intent id
    B->>A: payment again, with the intent id
  end
  A-->>B: order id and download token
  B-->>C: confirmation page
```

Pricing comes from one server-side module, so the price shown, the amount charged and the tax cannot drift apart. The payment, discount and support endpoints are rate limited, and temporary images are reached through unguessable ids and download tokens.

## Accounts

Customers sign in with Google, Microsoft or a code emailed to them. Signing in is optional until the customer wants to save a collage, see past orders or reorder. After sign-in, a collage made while signed out can be claimed into the account (`api/claim-collage`), which attaches it to the customer so it is kept longer. Claiming a collage the customer already owns is safe to repeat. Account settings include a data export and account deletion.

## The backend (private repository)

The API lives in a separate, private repository, so this repository cannot run the full order flow on its own. Everything the browser needs from it is listed in `src/services`, and the API URL is a build-time setting (`VITE_BACKEND_URL`). Only public values are ever bundled into the page: the Stripe publishable key and the sign-in client ids are in the build, and no secrets are. This section describes how the backend works, at the level that is useful to understand the storefront.

### How a collage is built

The build is a background job, because matching hundreds of photos to a large image is CPU heavy. The API accepts the request, stores the photos, queues the job and returns a task id straight away; the page then follows the job's progress.

```mermaid
flowchart LR
  REQ["Create request<br/>(api/collage)"] --> STORE[("Image storage<br/>photos and main image")]
  REQ --> QUEUE["Task queue<br/>(Celery + Redis)"]
  QUEUE --> W["Worker"]
  STORE --> W
  subgraph Steps["Inside the worker"]
    D["1. Decode and shrink<br/>the small photos"] --> M["2. Measure each photo<br/>(average brightness<br/>of its four quadrants)"]
    M --> G["3. Match photos to the<br/>grid cell by cell"]
    G --> P["4. Watermark and encode"]
    P --> SAVE["5. Save the result<br/>(retried if the database<br/>connection drops)"]
  end
  W --> D
  SAVE --> RES[("Preview image")]
  W -. "percent done" .-> STATE[("Task state")]
  STATE -. "polled by the page" .-> POLL["Task result<br/>(api/task-result)"]
```

How the matching works:

- **Photo collages.** The main image is converted to grey and cut into a grid. For each cell the code measures the average brightness of its four quadrants (top-left, top-right, bottom-left, bottom-right) and picks the small photo whose four quadrant averages are closest, by total absolute difference. Comparing quadrants, not one average, keeps edges and gradients inside a cell instead of flattening them.
- **Text and symbol collages.** The shape is a light/dark grid. The small photos are sorted by brightness and split into a light group and a dark group, sized to how much of the shape is dark (with a floor, so a thin letter still gets enough dark photos). Light photos are brightened slightly and dark ones dimmed, and each cell takes a photo from the matching group that is not the same as the neighbours already placed beside or above it, so the same picture does not repeat side by side.
- **Progress is reported honestly.** Each phase reports its share of the work, the percentage is capped below 100 until the result really exists, and updates that would not move the bar are skipped so a large grid does not flood the result store.
- **One build at a time per worker, in a fresh process.** Each worker process handles a single job and then exits, so memory from a large build is returned to the system. Time limits stop a runaway job, and the peak memory of each build is logged.

### Payments and order integrity

The storefront's checkout (above) ends in the payment call, which charges the card and creates the order. The backend is built so that money and orders cannot quietly drift apart:

- **One pricing module** produces the price shown, the amount charged and the tax, so they cannot disagree.
- **Stripe events are applied idempotently.** Refund and dispute events set an order's state to a fixed value taken from the event, so a duplicate or out-of-order delivery changes nothing. An event for a payment with no matching order is logged and acknowledged, not retried.
- **A read-only reconciliation check compares Stripe with the orders table.** It looks for a payment with no order, an order whose payment did not succeed or has a different amount, and a refund the order does not know about (a missed webhook). It only reports; it never changes data.
- **Email delivery problems feed back in.** Bounce and complaint notices from the email provider are logged as errors, so a mail problem is noticed by the owner and not found by a customer, and the address is opted out of marketing email to protect the sender's reputation.

### Data and access

- **Images live in object storage, not in the database.** Large image writes to the managed database kept dropping the connection, so the database holds only file names. Unpaid uploads are deleted by an hourly cleanup job.
- **Preview first.** The full-resolution file is only produced for a paid order.
- **Customers** sign in with Google, Microsoft or an emailed one-time code. Saved collages, order history, reorder, data export and account deletion hang off the customer record.
- **Prices are data, not code.** Prices, tax and shipping packages are rows an admin can edit, with a history of price changes. The supported print sizes are fixed in code.
- **Errors do not leak.** A 500 response carries a generic message; the exception and traceback go to the log and to error monitoring, never to the visitor.

### Tests

The backend has more than 250 automated tests, and none of them needs a real Stripe, shipping or email account: those are mocked. Three kinds are worth calling out:

- **Golden-image tests** build whole collages from tiny, computed inputs and compare them with stored images using a small tolerance (not byte equality), so an upgrade of NumPy, OpenCV or Pillow cannot silently change the output.
- **A real-Redis test** runs an actual Celery worker and cache against Redis, because the rest of the suite mocks Redis.
- **Payment tests** cover quotes, refunds, disputes and reconciliation.

Merging to the main branch runs the full suite first and only then deploys.

## Build, test and deploy

Pushing to `main` runs GitHub Actions: install, type-check, test, build, then publish the static build to GitHub Pages under the custom domain. Unit tests (Vitest and Testing Library) cover the network layer, payment requests, pricing, sign-in state and the wizard step logic. Most page components and the crop screens are not covered by automated tests. See the [README](../README.md) for commands and the list of settings.
