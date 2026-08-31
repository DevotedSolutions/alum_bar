# Frontend redesign — visual restyle to match Claude Design mockup

## Context

The user has a Claude Design mockup (`Frontend Redesign v2.dc.html`, project `0d8e247f-02b9-4385-909a-4c643a142650`) specifying a new visual language for the `frontend/` operations app: a dark sidebar (#1E222A), a teal header/accent (#0D8B92), Inter typography, card/table styling with dark (#2B303A) table headers, and consistent color-coded badges/tags for status. The goal is a pixel-accurate visual and component restyle of the existing app — **not** a rebuild. Business logic, API calls, routing destinations, and data models stay untouched.

Research (one Explore pass over `frontend/src` + direct reads of `App.js`, `NavBar.jsx`, `LayOut.jsx`, `productSchema.js`) confirmed the current app has no design-token/theme file (MUI theme is inline in `App.js`, primary `#08999D`), styling is ad hoc `sx`/inline styles per file, and several mockup screens show content/fields that don't exist in the app's data today (3-tier stock thresholds, Dashboard "stock to order"/"planning" sections, Scanner manual lookup + movements log, Job Sheets site/technician columns, a cart-builder "Quotation App" screen that actually lives in the sibling `job-sheets/` Vite app).

**Decisions already confirmed with the user:**
- Where the mockup shows data/fields that don't exist today: restyle using existing data only; adapt or omit, no schema/backend changes.
- "Quotation App" nav item keeps navigating to `/designation` (`AllDesignation.jsx`), just restyled — no new cart-builder page.
- Adopt the mockup's branding exactly: red circular "n" mark, "fermeture" wordmark, "ALU - PVC - ACIER" subtitle (replacing the current "Dasby Profile System" logo/text).
- Delivered in phases, with a checkpoint after each phase.

**Two additional judgment calls worth flagging up front** (both favor "prioritize existing code" per the user's own conflict rule):
- **Inventory quantity editing**: mockup shows inline +/− editing directly in the table row; today it's a modal. This is a pure presentation/interaction change using the same `setQuantity`/update-service calls — safe to adopt, but it's called out here since it changes an interaction pattern, not just colors.
- **Scanner flow**: today's scanner supports scanning multiple products into a running cart-drawer, then bulk-confirming sale. The mockup shows a simpler single-item scan → result panel → "Sell 1 unit"/"Receive 1" flow. Collapsing to the mockup's single-item flow would remove the multi-item cart capability — that's a feature regression, not a restyle. **Plan: keep the existing multi-item cart-drawer behavior, reskin its panels/buttons/colors to match the mockup's visual language.** The mockup's manual-lookup input and recent-movements table are omitted (no such data source exists today).

No stock-threshold field exists in `productSchema.js` (`backend/api/model/productSchema.js`) — only `quantity`. Quantity badges (green/amber/red) will use a fixed presentational cutoff defined once in a shared constants file (e.g. `0` = critical, `<10` = to order, else healthy) rather than a per-product field. This default will be visible/adjustable at the Phase 1 checkpoint.

---

## Phase 0 — Foundation: theme, sidebar, header, shared primitives

This underlies every later phase, so it goes first and gets its own checkpoint.

**New files:**
- `src/theme/tokens.js` — exports the mockup's color palette (sidebar `#1E222A`, header teal `#0D8B92`/hover `#0A7278`, body `#F4F6F7`, text `#22272E`, borders `#E4E7EA`/`#EDEFF2`, table header `#2B303A`, and the OK/WARN/BAD/info tone triples used throughout) plus small helpers (`statusTone(band)`, `badgeStyle()`, `tagStyle()`) mirroring the mockup's own `badge()`/`tag()` demo functions — this is what every later phase's badges/status chips will import instead of hardcoding hex values per file.
- `src/Components/common/ConfirmDialog.jsx` — one reusable delete-confirmation dialog (MUI `Dialog`, restyled per mockup's delete-modal look) to replace the duplicated inline dialogs in `Leaves.jsx`/`UserManagement.jsx` and the raw `window.confirm` in `UpdateCombo.jsx`. Adopted incrementally as each page is touched in its phase, not all at once.
- `src/Components/common/pageMeta.js` — route-prefix → `{ title, subtitle }` map (mirrors the mockup's `titles` object) used to drive the new per-page teal header.

**Edited files:**
- `src/index.css` — swap the global `* { font-family: myAvenirLight !important }` reset for Inter (Google Fonts import + fallback stack), keep the margin/padding/box-sizing reset. Set default body background to `#F4F6F7`.
- `src/App.js` — update the inline `createTheme()` call: `palette.primary.main` → `#0D8B92`, add `typography.fontFamily: 'Inter, sans-serif'`. No routing changes.
- `src/layout/LayOut.jsx` — restructure from the current `Box{marginTop:80px}` + fixed-`AppBar` hack to the mockup's actual shell shape: a full-height flex row (`<div style="display:flex;height:100vh">`) containing the sidebar and a `<main>` with a `<header>` (teal, page title/subtitle from `pageMeta.js`) above an independently-scrolling content area wrapping `<Outlet/>`. Route pages themselves are unaffected — only the shell around them changes.
- `src/Components/NavBar.jsx` — full visual rewrite, kept as the same file/export (`DrawerAppBar`, still the only thing `LayOut.jsx` imports) to avoid import churn elsewhere:
  - New brand block (red `#E8112D` circular "n" mark, "fermeture", "ALU - PVC - ACIER") replacing the `dasby.jpeg` block.
  - "MENU" section label + divider row.
  - Nav items restyled to match the mockup exactly (active item: teal bg `#0D8B92`/white/600 weight; inactive: `#D6DAE0`/400 weight; hover: `rgba(255,255,255,0.06)`), using the mockup's literal inline SVG icon markup in place of the current MUI icon set for pixel fidelity. Active state is derived from `useLocation().pathname` (mapped through the same route list already used for `navigate()` calls) rather than the mockup's fake internal `screen` state.
  - `itemsListAdmin`/`itemsListUser`/`itemsListStaff` arrays and all `navigate()` destinations, and the `handleLogout` behavior (clear 3 localStorage keys + navigate to `/login`), are preserved as-is — only rendering changes.
  - Add a genuine desktop collapse/expand toggle (mockup shows a `collapsed` state affecting sidebar width 272px↔92px and hiding labels) — a small chevron control near the brand block, local state in `NavBar.jsx`. The mockup's own bottom row reuses its (fake, demo-only) "Log out" label for this toggle; in the real app "Log out" stays a real, distinctly-rendered logout action at the bottom, styled to match, and collapse gets its own control.
  - Existing mobile responsive behavior (temporary/swipeable `Drawer` below the `sm` breakpoint) is preserved, just reskinned — the mockup doesn't address mobile, so this is carried over rather than invented.
- App-wide toast styling: configure the single `<ToastContainer/>` already mounted in `App.js` to match the mockup's toast look (dark `#22272E`, rounded, bottom-centered). Redundant local `<ToastContainer/>` mounts in `InventoryPage.jsx`/`AllProduct.jsx`/`OpenScanner.jsx` are removed opportunistically when those files are touched in their own phases, not in Phase 0.

**Verification:** `yarn start`, log in as admin/user/staff and confirm: sidebar renders with new branding/colors/icons and correct per-role item sets, active-item highlighting follows the current route, collapse toggle works, logout still clears storage and redirects to `/login`, every existing route still renders inside the new shell without layout breakage, mobile drawer still opens/closes.

---

## Phase 1 — Inventory + Products

**Files:** `src/Pages/InventoryPage.jsx`, `src/Components/Products/AllProduct.jsx`, `src/Components/ExportOptions.jsx` (button restyle only).

- Restyle search bar, PDF/CSV export buttons, category-grouped table (dark `#2B303A` header row, category divider rows, quantity badges via `theme/tokens.js`) to match the mockup.
- Convert quantity editing from the current modal to inline row +/− editing (same update-service calls, presentation change only) — flagged above.
- Add "Generate Sell QR Code" modal restyle (functionality already close to the mockup, per research).
- Products screen: add search input + category filter dropdown (frontend-only, filtering the already-fetched product array — no new data), restyle product cards (grouped by category, Edit/Delete buttons, quantity badge), restyle Add/Edit product modal — **without** the mockup's 3-tier threshold fields (excluded per decision), keeping the existing field set (name, code, description, category, color/cermone/vitrage from `Utility/data.js`, price, quantity).
- Introduce the shared `ConfirmDialog` for product delete (currently no confirmation step at all on this screen — this closes a real gap, not scope creep, since a delete confirmation is implied by the mockup's own delete-modal).

**Verification:** search/filter both screens, add/edit/delete a product, adjust quantity inline, confirm quantity badge colors change at the 0 / <10 / ≥10 cutoffs, generate a Sell QR code, export PDF/CSV — confirm no console errors and all existing network calls still fire (check Network tab against pre-change behavior).

---

## Phase 2 — Leaves, User Management, Quotation Export

**Files:** `src/Pages/Leaves.jsx`, `src/Pages/UserManagement.jsx`, `src/Pages/QuotationExport.jsx`.

- Leaves: restyle "Apply Leave" button + modal, leave-type summary cards (add progress bars computed from the existing used/available numbers — visual only), leave-requests table with status tags via `theme/tokens.js`. Add a status filter dropdown (frontend-only over existing fetched leave list). Swap the inline delete `Dialog` for the shared `ConfirmDialog`.
- User Management: restyle Add User button/modal, add search input + role filter (frontend-only), render roles as colored tags (ADMIN/STAFF/USER tones) instead of plain text, restyle Edit/Delete icon buttons. Swap inline delete `Dialog` for `ConfirmDialog`.
- Quotation Export: restyle search/table/checkboxes/export-selected + per-row download/delete to match the mockup's table look (already structurally close per research); add a header "select all" checkbox (small addition using the existing `selectedRows` state).

**Verification:** apply/approve/reject a leave, add/edit/delete a user, search+filter on both screens, select-all + export-selected + per-row download/delete on Quotation Export — confirm existing service calls are unchanged.

---

## Phase 3 — Calendar + Scanner

**Files:** `src/Pages/MURCalendar.jsx`, `src/Components/calendar/Map.jsx`, `src/Pages/OpenScanner.jsx`, `src/Components/HTML5QRCode.jsx`.

- Calendar: move the Mauritius/Mayotte toggle from the page body into the teal header (Calendar-only), sharing state via a small `RegionContext` provided in `LayOut.jsx` so `MURCalendar.jsx` keeps reading/writing the same region value it does today, just relocated. Restyle via `react-big-calendar`'s custom toolbar (reusing/reviving `Pages/custumTollbar/CustumTolbar.jsx` if it fits, or a new toolbar component) plus targeted `.rbc-*` CSS overrides — no rebuild of the calendar grid, so all existing event data/click/drag behavior is preserved. Add a color legend row reflecting the existing `getEventStyle()` color mapping (visual only, no new data).
- Scanner: restyle the scan box, buttons, cart-drawer, and any per-row displays to match the mockup's colors/typography/spacing, **keeping the existing multi-item cart-drawer flow** (per the decision above) rather than the mockup's single-item panel.

**Verification:** Calendar — region toggle in header still switches whatever it drove before (confirm by comparing to current behavior before the move), add/view events, month/week/day views still work, map toggle still works. Scanner — scan multiple items into the cart, adjust quantities, confirm sell, print — confirm no behavior change versus current.

---

## Phase 4 — Dashboard, Job Sheets, Quotation App (AllDesignation) restyle

**Files:** `src/Components/DashBoard.jsx`, `src/Components/LastWeekSales.jsx`, `src/Components/Products/totalRevenue.jsx`, `src/Pages/JobSheet.jsx`, `src/Pages/JobSheetList.jsx`, `src/Pages/JobSheetDetail.jsx`, `src/Components/jobSheets/*`, `src/Components/admin/AllDesignation.jsx` (+ its Add/Update modals, buttons only).

- Dashboard: keep existing content (KPI cards, Top-5 Revenue/Sold tables, sales/revenue charts) — this differs from the mockup's "stock to order"/"planning this week" content, which isn't backed by existing data (per decision, no new backend calls). Restyle KPI cards to color-coded accents (teal/amber/red per meaning, replacing the current stepped-gray palette) and tables/charts to the new card/dark-header visual language.
- Job Sheets: restyle the three-level table/list screens (list → sheets-in-job → item detail) with the new header/table/button language, **keeping existing columns** (Status/Type/Created Date/Sheets Inside/Details/Actions) rather than adding the mockup's site/technician/scheduled columns (no such fields in the data model). Add a search/status-filter control if it fits cleanly over already-fetched data.
- AllDesignation ("Quotation App" nav target): restyle buttons/cards/discount inputs only — Add Designation/Add Combo/discount-application/category-card functionality untouched. Swap `UpdateCombo.jsx`'s `window.confirm` for the shared `ConfirmDialog`.

**Verification:** Dashboard loads with no console errors and correct data; Job Sheets list → sheet detail → item detail navigation still works, PDF/Excel export still works; AllDesignation add/edit designation & combo, discount application, and navigation to `UpdateDesignation.jsx` still work.

---

## Cross-cutting verification (after each phase)

- `yarn start`, exercise the touched screens as each of the three roles (admin/user/staff) where relevant, confirm role-gated routes/nav items are unchanged.
- Confirm no change to any file under `services/` or any backend file — this redesign is frontend-presentation-only.
- Spot-check responsive/mobile drawer behavior isn't broken by the Phase 0 shell change.
- `yarn build` at the end of each phase to catch any compile errors early.
