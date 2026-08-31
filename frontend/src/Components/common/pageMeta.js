// Route-prefix -> { title, subtitle, navKey } map driving the redesigned
// teal page header and the sidebar's active-item highlighting.
// Ordered longest/most-specific prefix first since lookup is "starts with".

const ROUTES = [
  { prefix: "/jobsheets/", title: "Job Sheets", subtitle: "Workshop job detail", navKey: "jobs" },
  { prefix: "/jobsheets", title: "Job Sheets", subtitle: "Workshop jobs", navKey: "jobs" },
  { prefix: "/dashboard", title: "Dashboard", subtitle: "Operations overview", navKey: "dashboard" },
  { prefix: "/inventory", title: "Inventory", subtitle: "Stock management", navKey: "inventory" },
  { prefix: "/allproduct", title: "Products", subtitle: "Product management", navKey: "products" },
  { prefix: "/open-scanner", title: "Scanner", subtitle: "Scan & sell", navKey: "scanner" },
  { prefix: "/lastweek", title: "Sales", subtitle: "Last week sales", navKey: null },
  { prefix: "/calendar", title: "Planning", subtitle: "Team schedule", navKey: "calendar" },
  { prefix: "/leaves", title: "Leaves", subtitle: "Leave management", navKey: "leaves" },
  { prefix: "/designation", title: "Quotation App", subtitle: "Catalogue & discounts", navKey: "quoteApp" },
  { prefix: "/quotation-export", title: "Quotation Export", subtitle: "Customer quotations", navKey: "quoteExport" },
  { prefix: "/users", title: "User Management", subtitle: "Team & access", navKey: "users" },
  { prefix: "/home", title: "Home", subtitle: "", navKey: null },
];

/** Look up { title, subtitle, navKey } for the current pathname. */
export function getPageMeta(pathname) {
  const match = ROUTES.find((r) => pathname.startsWith(r.prefix));
  return match || { title: "", subtitle: "", navKey: null };
}
