// Shared design tokens for the redesigned frontend.
// Mirrors the palette/typography from the Claude Design mockup
// ("Frontend Redesign v2.dc.html") so every screen pulls from one place
// instead of hardcoding hex values per file.

export const COLORS = {
  sidebarBg: "#1E222A",
  sidebarHover: "rgba(255,255,255,0.06)",
  sidebarDivider: "rgba(255,255,255,0.13)",
  sidebarTextMuted: "#8A9199",
  sidebarTextInactive: "#D6DAE0",
  brandRed: "#E8112D",

  headerTeal: "#0D8B92",
  headerTealHover: "#0A7278",
  accentTealBorder: "#8ECFD1",
  accentTealTint: "#EEF8F8",

  bodyBg: "#F4F6F7",
  textPrimary: "#22272E",
  textSecondary: "#4A5158",
  textMuted: "#6E757C",
  textFaint: "#8A9199",

  cardBorder: "#E4E7EA",
  rowBorder: "#EDEFF2",
  inputBorder: "#D8DCE0",
  neutralChipBg: "#F1F3F5",
  neutralChipFg: "#3A4150",

  tableHeaderBg: "#2B303A",
  groupRowBg: "#F1F4F6",
  groupRowFg: "#1F5F63",

  toastBg: "#22272E",
};

// Status "tone" triples (background / border / foreground) used for
// quantity badges, leave/job status tags, and stock-movement chips.
export const TONE = {
  ok: { bg: "#EAF7EE", border: "#A9DCB8", fg: "#1E7E42" },
  warn: { bg: "#FFF6E5", border: "#F2CE84", fg: "#A76A00" },
  bad: { bg: "#FDECEE", border: "#F3B6BC", fg: "#D22D3A" },
  info: { bg: "#EAF3FB", border: "#AFCDE8", fg: "#1B5C93" },
  neutral: { bg: "#F1F3F5", border: "#D8DCE0", fg: "#4A5158" },
};

// No per-product stock-threshold field exists in the schema today
// (see backend/api/model/productSchema.js) — these are fixed
// presentational cutoffs for the quantity badge, not stored data.
export const STOCK_CUTOFFS = {
  criticalMax: 0, // qty <= this -> "bad" (critical / red)
  warnMax: 9, // qty <= this (and > criticalMax) -> "warn" (to order / amber)
  // qty > warnMax -> "ok" (healthy / green)
};

/** Classify a quantity into 'ok' | 'warn' | 'bad' using STOCK_CUTOFFS. */
export function stockBand(qty) {
  const q = Number(qty) || 0;
  if (q <= STOCK_CUTOFFS.criticalMax) return "bad";
  if (q <= STOCK_CUTOFFS.warnMax) return "warn";
  return "ok";
}

/** Inline style object for a quantity/status badge in a given tone. */
export function badgeStyle(tone, size = "md") {
  const t = TONE[tone] || TONE.neutral;
  return {
    display: "inline-block",
    minWidth: size === "lg" ? 44 : 34,
    background: t.bg,
    border: `1px solid ${t.border}`,
    color: t.fg,
    fontSize: size === "lg" ? 14 : 13,
    fontWeight: 700,
    padding: "5px 11px",
    borderRadius: 5,
    textAlign: "center",
  };
}

/** Inline style object for an uppercase status/role tag in a given tone. */
export function tagStyle(tone) {
  const t = TONE[tone] || TONE.neutral;
  return {
    display: "inline-block",
    background: t.bg,
    border: `1px solid ${t.border}`,
    color: t.fg,
    fontSize: 11.5,
    fontWeight: 700,
    letterSpacing: "0.05em",
    padding: "5px 11px",
    borderRadius: 5,
    textTransform: "uppercase",
  };
}

export const FONT_FAMILY = "'Inter', 'source sans pro light', sans-serif";

// Shared MUI `sx` button styles, matching the mockup's button system, so
// every screen's toolbar/table-action buttons look identical instead of
// each file inventing its own variant.
export const buttonSx = {
  primary: (height = "44px") => ({
    height,
    background: COLORS.headerTeal,
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "0 24px",
    fontSize: "14.5px",
    fontWeight: 600,
    textTransform: "none",
    boxShadow: "none",
    "&:hover": { background: COLORS.headerTealHover, boxShadow: "none" },
  }),
  outline: (height = "36px") => ({
    height,
    background: "#fff",
    border: `1px solid ${COLORS.accentTealBorder}`,
    color: COLORS.headerTeal,
    borderRadius: "6px",
    padding: "0 16px",
    fontSize: "13.5px",
    fontWeight: 600,
    textTransform: "none",
    whiteSpace: "nowrap",
    "&:hover": { background: COLORS.accentTealTint, boxShadow: "none" },
  }),
  neutral: (height = "36px") => ({
    height,
    background: "#fff",
    border: `1px solid ${COLORS.inputBorder}`,
    color: "#2C323A",
    borderRadius: "6px",
    padding: "0 16px",
    fontSize: "13.5px",
    fontWeight: 500,
    textTransform: "none",
    whiteSpace: "nowrap",
    "&:hover": { borderColor: COLORS.headerTeal, color: COLORS.headerTeal, boxShadow: "none" },
  }),
  danger: (height = "34px") => ({
    height,
    background: "#fff",
    border: "1px solid #F0B4B9",
    color: "#D22D3A",
    borderRadius: "6px",
    padding: "0 16px",
    fontSize: "13px",
    fontWeight: 600,
    textTransform: "none",
    "&:hover": { background: "#FDF0F1", boxShadow: "none" },
  }),
};

export const inputSx = {
  height: "44px",
  boxSizing: "border-box",
  border: `1px solid ${COLORS.inputBorder}`,
  borderRadius: "6px",
  padding: "0 14px",
  fontSize: "14px",
  color: COLORS.textPrimary,
  outline: "none",
  background: "#fff",
};
