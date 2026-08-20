# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository structure

This is a monorepo with three independent, separately-deployed apps — there is no shared root `package.json`, and each app manages its own dependencies:

- **`backend/`** — Express + MongoDB (Mongoose) REST API. Serves all three apps.
- **`frontend/`** — Create React App (react-scripts). The main operations app: inventory/products, quotations, job sheets, calendar/leaves, user management.
- **`job-sheets/`** — Vite + React app named `quotation-app`. A more focused product-selection/quotation cart UI that talks to the same backend.

The business domain is aluminum/PVC window & door ("menuiserie") manufacturing and quotation for a company operating as noutfermeture.com — product/profile catalogs, price quotations, and manufacturing "job sheets" that compute cutting lists and material optimization.

## Commands

### backend
```bash
cd backend
yarn install        # or npm install
node index.js        # start server (listens on PORT env var, default 1000)
```
There is no lint/test/build script configured for the backend (`npm test` is a stub that exits with an error).

### frontend (CRA)
```bash
cd frontend
yarn install
yarn start           # dev server on :3000
yarn build            # production build
yarn test             # react-scripts test (Jest, watch mode)
```
Run a single test file: `yarn test src/Components/SomeComponent.test.js`.

### job-sheets (Vite)
```bash
cd job-sheets
yarn install
yarn dev              # Vite dev server
yarn build             # production build
yarn preview            # preview production build
yarn lint               # eslint . --ext js,jsx --max-warnings 0
```

## Architecture

### Backend (`backend/api/`)
- **Entry point**: [index.js](backend/index.js) wires up Express, connects to MongoDB via [api/db config/db.js](backend/api/db%20config/db.js), and mounts four route modules under `/api`: `routes.js` (auth/users/events/leaves), `product_routes.js` (inventory), `quotation_routes.js` (quotations/designations/combos), `jobSheets_routes.js` (job sheets).
- **Auth**: JWT-based, via [api/middle/authMiddleware.js](backend/api/middle/authMiddleware.js). The JWT secret is currently hardcoded in that file rather than read from `.env`. Roles live on the user document (`UserSchema.role`, an array e.g. `["admin"]`, `["user"]`, `["staff"]`) and are checked client-side in the frontend router, not enforced per-route on the backend beyond `authMiddleware` requiring *a* valid token. Note that several quotation/job-sheet routes intentionally omit `authMiddleware` (e.g. `get-all-gamme`, `add-designation`, `save-file`, all of `jobSheets_routes.js`) — check the specific route file before assuming auth is enforced.
- **File uploads**: Handled by three separate multer middlewares ([multrMidlewre.js](backend/api/middle/multrMidlewre.js), [quotationMiddleware.js](backend/api/middle/quotationMiddleware.js), [quatationfileMiddleware.js](backend/api/middle/quatationfileMiddleware.js)) writing to `uploads/`, `quotationuploads/`, and served statically from `/uploads`, `/files`, `/quotationuploads`.
- **Job sheet product calculators** (`backend/api/controller/frappeProducts/`): one file per window/door product code (e.g. `f1`/`f2`/`f3`/`f4` = fenêtre variants, `pf1` = porte-fenêtre, `pe1`/`pe2`/`pe2-tra` = porte d'entrée, `vb1`/`vb2` = baie vitrée, `vp1`/`vp2`, `pcv1`/`pcv2`/`pcv-haut1`/`pcv-haut2`, `pob1`/`pob2`, `pobe1`/`pobe2`, `psp1`/`psp2`, `sou1`/`sou2`, `pcp`/`pcp2`, `of1`/`of2`, `fp`). Each exports a `get<Code>Data`-style function that, given dimensions/options, returns the profile/accessory/glazing breakdown for that product type. [job-sheets-controller.js](backend/api/controller/job-sheets-controller.js) dispatches to the right calculator based on job sheet `type`.
- **Cutting-list optimization**: [optimize.js](backend/api/controller/frappeProducts/optimize.js) runs two different bin-packing algorithms (`JobSheetOptimizationAlgo1`/`2`) against a fixed 5795mm bar length and picks whichever produces less total usage (tie-broken by wastage) — this is the "optimize" step exposed via `POST /api/optimizeProfile`.
- **Export**: job sheets can be exported to PDF ([exportPDF.js](backend/api/controller/frappeProducts/exportPDF.js), via `pdfkit`) or Excel ([exportToXLSX.js](backend/api/controller/frappeProducts/exportToXLSX.js), via `exceljs`).
- **Models** (`backend/api/model/`): `UserSchema`, `productSchema`, `jobsheetSchema` (the parent job sheet / project), `frappeJobSheetSchema` (individual window/door items within a job sheet, embedding `profiles`/`accessories`/`glazzingValues` subdocuments), `QuoteSchema`, `Combo.js`, `DiscountSchema`, `gammeSchema` (product ranges/tiers), `client.js`, `eventSchema`, `leaveSchema`, `designationSchema`.

### Frontend (`frontend/src/`) — main operations app
- Routing/auth gating happens entirely in [App.js](frontend/src/App.js): login state and role (`admin`/`user`/`staff`) are read from `localStorage` (`tokenDesby`, `UserRole`) and used to conditionally register routes — there's no centralized `PrivateRoute` component, and role changes are picked up via a `storage` event listener.
- `Pages/` holds route-level screens (JobSheet, JobSheetList, JobSheetDetail, InventoryPage, Leaves, MURCalendar, UserManagement, QuotationExport); `Components/` holds reusable/feature pieces, notably `Components/jobSheets/`, `Components/Products/`, `Components/admin/`, `Components/calendar/`, `Components/PDF/`.
- `services/` wraps API calls per domain (`products/`, `jobSheets/`, `designation/`, `Events.js`, `User.js`, `login.js`, `SignUp.js`), all built on the shared axios instance in [services/BaseUrl.js](frontend/src/services/BaseUrl.js), which also attaches the `tokenDesby` bearer token via a request interceptor.
- The API base URL is currently hardcoded to the production URL (`https://app.noutfermeture.com/api`) with `localhost`/staging URLs left commented out above it — swap the active `baseURL` line when pointing at a different backend instead of adding env-based config, to match the existing pattern.

### job-sheets (`job-sheets/src/`) — Vite quotation-cart app
- Vite + MUI, structured similarly but standalone: `api/BaseUrl.js` (same hardcoded-URL pattern as frontend), `api/Products-apis/`, `components/Cart/`, `components/Products/`, `pages/LayoutPage.jsx`, `utility/` (`bbdData.js`, `priceFormula.js`, `tube.js` — pricing/geometry helper logic for product configuration).
- No routing framework usage beyond a single layout page pattern; this app is scoped to product browsing → cart → quotation rather than the full back-office feature set in `frontend/`.

## Working across the two frontends

`frontend` and `job-sheets` are independent React apps with **no shared package or code import between them** — duplication (e.g. `BaseUrl.js`, product/pricing logic) is expected and intentional given the current structure; don't assume a change in one propagates to the other.
