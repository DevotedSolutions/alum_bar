# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> This app is part of a larger monorepo. See `../CLAUDE.md` for the overall repo structure, the backend API it talks to, and how this app relates to the sibling `job-sheets/` app. This file covers `frontend/`-specific detail.

## Commands

```bash
yarn install
yarn start                                  # dev server on :3000
yarn build                                  # production build
yarn test                                   # react-scripts test (Jest, watch mode)
yarn test src/Components/SomeComponent.test.js   # run a single test file
```

There is no configured lint script (CRA's build-time ESLint via `eslintConfig` in [package.json](package.json) is the only linting).

## Architecture

### Auth and routing (`src/App.js`)

All routing and access control lives in one file, [src/App.js](src/App.js) — there is no separate router config or `PrivateRoute` component:

- Login state (`isLoggedIn`) and role flags (`isAdmin`, `isInventoryUser`, `isStaff`) are derived directly from `localStorage` (`tokenDesby` for the JWT, `UserRole` for the role) on every render via `useState` initializers.
- Role checks use `=== "admin"` OR `.includes("admin")` — tolerating `UserRole` being stored as either a plain string or a stringified array.
- Routes are conditionally *registered* (not just guarded) based on these flags — an admin route simply doesn't exist in the route tree for a non-admin user, so unauthorized access falls through to the catch-all `/*` redirect rather than a rendered "forbidden" page.
- Role/login state does not update reactively on its own; a `storage` event listener re-reads `localStorage` and updates state, so cross-tab login/logout is picked up automatically, but this means role or token changes made by code within the same tab (outside `handleLogin`) need an explicit `window.dispatchEvent(new Event("storage"))` or equivalent to be reflected without a full reload.
- On mount, `checkTokenExpiration()` (from `services/products/getAllProducts.js`) is called once to redirect to `/login` if the stored JWT has expired — this check is not repeated per-navigation.
- Route access by role: **admin** gets everything (dashboard, inventory, products, scanner, sales, calendar, leaves, designations, quotation export, users, job sheets); **user** (inventory role) gets `/inventory` and `/open-scanner` only; **staff** gets `/calendar` and `/leaves` only.

### Service layer (`src/services/`)

Every API call goes through the shared axios instance in [src/services/BaseUrl.js](src/services/BaseUrl.js), which:
- Has `baseURL` hardcoded to `https://app.noutfermeture.com/api`, with `localhost:1000` and a staging IP left commented out directly above it — to point at a different backend, swap which line is uncommented rather than introducing env-based config, to match the existing pattern (mirrored in `job-sheets/api/BaseUrl.js`).
- Attaches the JWT from `localStorage["tokenDesby"]` as a `Bearer` token via a request interceptor, so individual service functions never need to handle auth headers themselves.

Services are organized one-file-per-operation under domain folders (`services/products/`, `services/jobSheets/`, `services/designation/`, plus flat files `Events.js`, `User.js`, `login.js`, `SignUp.js`) — e.g. `services/products/addProducts.js`, `deleteProduct.js`, `updateQuantity.js` are separate modules rather than one grouped `products.js`. Follow this per-operation file convention when adding new API calls.

### Feature areas

- **Job sheets** (`Pages/JobSheet.jsx`, `JobSheetList.jsx`, `JobSheetDetail.jsx`, `Components/jobSheets/`): the manufacturing job-sheet workflow — creating a job sheet, listing items within it, and a detail view with `OptimizationTable.jsx` (renders the backend's cutting-list optimization result) and `GlazzingTable.jsx` (glazing breakdown). `Components/jobSheets/functions.js` holds shared helper logic for this feature.
- **Inventory/products** (`Pages/InventoryPage.jsx`, `Components/Products/`, `Pages/ShowProduct/`): product CRUD, stock quantity adjustments, and the QR/barcode scanner flow (`Pages/OpenScanner.jsx`, `Components/HTML5QRCode.jsx`, using `html5-qrcode`/`react-qr-barcode-scanner`/`qr-scanner` — multiple scanner libraries are present, check which is actually wired into the active route before adding a new one).
- **Admin/catalog** (`Components/admin/`): designation (product line-item) and combo management — `AddDesignation`/`UpdateDesignation`/`AllDesignation` and `AddCombos`/`UpdateCombo`.
- **Calendar/leaves** (`Pages/MURCalendar.jsx`, `Pages/Leaves.jsx`, `Components/calendar/`): built on `react-big-calendar`; `Components/calendar/Map.jsx` uses `react-leaflet`/`leaflet` for location display.
- **Quotation export** (`Pages/QuotationExport.jsx`): exports quotations, backed by `@react-pdf/renderer`/`jspdf`/`react-pdf` for PDF generation and `json2csv`/`react-csv`/`papaparse` for CSV.
- **User management** (`Pages/UserManagement.jsx`): admin-only user/role administration, paired with `services/User.js`.

### Layout

`layout/LayOut.jsx` wraps all authenticated routes (mounted once in `App.js` as the parent `element` of the logged-in `<Route>`), and `Components/NavBar.jsx` provides navigation. `LoginLayout/LoginLayout.jsx` is the equivalent wrapper for the unauthenticated login/signup/password-reset routes.

## Known constraints worth checking before changing

- The `theme` (MUI, primary color `#08999D`) is created inline inside `App.js` on every render rather than hoisted — be aware if adding logic that assumes a stable theme reference.
- Several scanner-related packages (`html5-qrcode`, `qr-scanner`, `react-qr-barcode-scanner`, `react-qr-reader`, `@yudiel/react-qr-scanner`) are all present in `package.json`; confirm which one the current `Pages/OpenScanner.jsx` implementation actually uses before assuming a given library is live.
