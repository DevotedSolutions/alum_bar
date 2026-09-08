import { Box, useMediaQuery } from "@mui/material";

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

import { getStockSummary } from "../services/dashboard/getStockSummary";
import { getMetalPrice } from "../services/dashboard/getMetalPrice";
import { getNews } from "../services/dashboard/getNews";
import { getExchangeRates } from "../services/dashboard/getExchangeRates";
import { getEventsByCountry } from "../services/Events";
import { useRegion } from "./common/RegionContext";
import { COLORS } from "../theme/tokens";

// How each stock band reads in the reorder table and the weight breakdown.
// Keys match the band names returned by GET /api/dashboard/stock-summary.
const BANDS = {
  critical: { label: "Critical", tag: "CRITICAL", color: "#D22D3A", chipBg: "#FDECEE", chipBorder: "#F3B6BC" },
  low: { label: "Low stock", tag: "LOW", color: "#E8912B", chipBg: "#FFF3E2", chipBorder: "#F2CE84" },
  buffer: { label: "Buffer stock", tag: "BUFFER", color: COLORS.headerTeal, chipBg: COLORS.accentTealTint, chipBorder: COLORS.accentTealBorder },
};
const BAND_ORDER = ["critical", "low", "buffer"];

// Flag shown beside a currency pair. Presentation only - the rates themselves
// come from the exchange-rate collection.
const CURRENCY_FLAG = {
  USD: "\u{1F1FA}\u{1F1F8}",
  EUR: "\u{1F1EA}\u{1F1FA}",
  GBP: "\u{1F1EC}\u{1F1E7}",
  AUD: "\u{1F1E6}\u{1F1FA}",
  ZAR: "\u{1F1FF}\u{1F1E6}",
  CNY: "\u{1F1E8}\u{1F1F3}",
  INR: "\u{1F1EE}\u{1F1F3}",
  AED: "\u{1F1E6}\u{1F1EA}",
  MUR: "\u{1F1F2}\u{1F1FA}",
};

const MCB_RATES_URL = "https://www.mcb.mu";
const TE_STREAM_URL = "https://tradingeconomics.com/stream";

// --- Small presentational helpers --------------------------------------

const fmtKg = (n) => Math.round(Number(n) || 0).toLocaleString("en-US");

const fmtPct = (n) => {
  const v = Number(n) || 0;
  return `${v > 0 ? "+" : ""}${v.toFixed(1)}%`;
};

// Feed stories are often a few days old, so the day matters as well as the time.
const fmtDateTime = (value) => {
  if (!value) return "";
  const d = new Date(value);
  const isToday = d.toDateString() === new Date().toDateString();
  const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return isToday ? time : `${d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} ${time}`;
};

/**
 * Clock time for a task in today's list. An event that began on an earlier day
 * has no start time that means anything today, so it reads as all-day instead.
 */
const taskTime = (task) => {
  const start = moment(new Date(task.start));
  if (!start.isValid()) return "";
  return start.isBefore(moment().startOf("day")) ? "ALL DAY" : start.format("HH:mm");
};

const panelSx = {
  background: "#fff",
  border: `1px solid ${COLORS.cardBorder}`,
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 1px 3px rgba(20,26,32,0.05)",
  display: "flex",
  flexDirection: "column",
};

const cardSx = {
  background: "#fff",
  border: `1px solid ${COLORS.cardBorder}`,
  borderRadius: "8px",
  padding: { xs: "16px 14px 18px", sm: "18px 22px 20px" },
  boxShadow: "0 1px 3px rgba(20,26,32,0.05)",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const cardLabelSx = {
  fontSize: "12.5px",
  fontWeight: 700,
  letterSpacing: "0.09em",
  textTransform: "uppercase",
  color: COLORS.textSecondary,
};

const thSx = {
  padding: "11px 12px",
  textAlign: "left",
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: COLORS.textMuted,
  borderBottom: `1px solid ${COLORS.cardBorder}`,
  whiteSpace: "nowrap",
};

const tdSx = {
  padding: "13px 12px",
  borderBottom: `1px solid ${COLORS.rowBorder}`,
  fontSize: "13.5px",
  color: COLORS.textSecondary,
  whiteSpace: "nowrap",
};

// Reorder table columns. Only Product is elastic - the rest are sized to their
// content so a long product name never squeezes the numbers into a wrap.
const REORDER_COLUMNS = [
  { key: "status", label: "Status", width: 112, render: (r) => <StatusChip band={r.band} /> },
  {
    key: "product",
    label: "Product",
    render: (r) => r.productName,
    // Wrap on spaces; break inside a word only if one genuinely cannot fit.
    cellSx: () => ({
      fontWeight: 600,
      color: COLORS.textPrimary,
      whiteSpace: "normal",
      overflowWrap: "break-word",
      wordBreak: "normal",
    }),
  },
  { key: "code", label: "Code", width: 104, render: (r) => r.productcode },
  {
    key: "current",
    label: "Current",
    width: 88,
    align: "right",
    render: (r) => r.current,
    cellSx: (r) => ({ fontWeight: 700, color: (BANDS[r.band] || BANDS.buffer).color }),
  },
  { key: "healthy", label: "Healthy", width: 88, align: "right", render: (r) => r.healthy },
  { key: "orderQty", label: "Order qty", width: 96, align: "right", render: (r) => r.orderQty },
  {
    key: "orderKg",
    label: "Order kg",
    width: 108,
    align: "right",
    render: (r) => `${fmtKg(r.orderKg)} kg`,
    cellSx: () => ({ fontWeight: 700, color: COLORS.textPrimary }),
  },
];

/** Wider gutter on the outer edges, tighter between columns. */
const cellEdgePad = (i, len) => ({
  paddingLeft: i === 0 ? 20 : 12,
  paddingRight: i === len - 1 ? 20 : 12,
});

const emptySx = {
  fontSize: "13.5px",
  color: COLORS.textFaint,
  padding: "22px 20px",
};

/** Dark panel header with the teal underline accent from the mockup. */
const PanelHeader = ({ title, aside }) => (
  <Box
    sx={{
      background: COLORS.tableHeaderBg,
      padding: { xs: "14px 14px 0", sm: "14px 20px 0" },
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: "16px",
    }}
  >
    <Box
      sx={{
        color: "#fff",
        fontSize: "13.5px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        borderBottom: `3px solid ${COLORS.headerTeal}`,
        paddingBottom: "11px",
        display: "inline-block",
      }}
    >
      {title}
    </Box>
    {aside && <Box sx={{ paddingBottom: "11px" }}>{aside}</Box>}
  </Box>
);

/** Minimal inline sparkline; `dots` matches the price card in the mockup. */
const Sparkline = ({ values = [], color = COLORS.headerTeal, width = 210, height = 54, dots = false }) => {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pad = dots ? 4 : 2;
  const points = values.map((v, i) => {
    const x = pad + (i * (width - pad * 2)) / (values.length - 1);
    const y = height - pad - ((v - min) / span) * (height - pad * 2);
    return [x, y];
  });
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block", maxWidth: "100%" }}>
      <polyline
        points={points.map(([x, y]) => `${x},${y}`).join(" ")}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {dots &&
        points.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.6" fill="#fff" stroke={color} strokeWidth="1.5" />
        ))}
    </svg>
  );
};

const OutlineButton = ({ children, onClick }) => (
  <Box
    component="button"
    type="button"
    onClick={onClick}
    sx={{
      background: COLORS.headerTeal,
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      padding: "9px 18px",
      fontSize: "13px",
      fontWeight: 600,
      cursor: "pointer",
      whiteSpace: "nowrap",
      "&:hover": { background: COLORS.headerTealHover },
    }}
  >
    {children}
  </Box>
);

const GhostButton = ({ children, onClick }) => (
  <Box
    component="button"
    type="button"
    onClick={onClick}
    sx={{
      background: "#fff",
      color: COLORS.headerTeal,
      border: `1px solid ${COLORS.accentTealBorder}`,
      borderRadius: "6px",
      padding: "9px 18px",
      fontSize: "13px",
      fontWeight: 600,
      cursor: "pointer",
      whiteSpace: "nowrap",
      "&:hover": { background: COLORS.accentTealTint },
    }}
  >
    {children}
  </Box>
);

const StatusChip = ({ band }) => {
  const b = BANDS[band] || BANDS.buffer;
  return (
    <Box
      component="span"
      sx={{
        display: "inline-block",
        background: b.chipBg,
        border: `1px solid ${b.chipBorder}`,
        color: b.color,
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.06em",
        padding: "5px 12px",
        borderRadius: "5px",
      }}
    >
      {b.tag}
    </Box>
  );
};

const NewsGlyph = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.headerTeal} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <line x1="7" y1="9" x2="12" y2="9" />
    <line x1="7" y1="13" x2="12" y2="13" />
    <line x1="7" y1="16" x2="10" y2="16" />
    <line x1="16" y1="9" x2="17" y2="9" />
  </svg>
);

const CheckGlyph = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1E7E42" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="11" stroke="none" />
    <polyline points="7.5 12.4 10.6 15.4 16.5 9" fill="none" />
  </svg>
);

// --- Page ---------------------------------------------------------------

const EMPTY_SUMMARY = {
  totalOrderWeightKg: 0,
  containerCapacityKg: 0,
  containerPct: 0,
  containerFreeKg: 0,
  weightByBand: { critical: 0, low: 0, buffer: 0 },
  reorder: [],
};

const DashBoard = () => {
  const navigate = useNavigate();
  const { region } = useRegion();

  // Below this the reorder table is rebuilt as stacked cards and the denser
  // rows drop their sparklines, so nothing has to scroll sideways.
  const isNarrow = useMediaQuery("(max-width:899.95px)");
  const isVeryNarrow = useMediaQuery("(max-width:599.95px)");

  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [metalPrice, setMetalPrice] = useState(null);
  const [news, setNews] = useState([]);
  const [fx, setFx] = useState({ rates: [], source: null, asOf: null });
  const [events, setEvents] = useState([]);
  const [priceUnit, setPriceUnit] = useState("kg");
  const [openStory, setOpenStory] = useState(null);

  async function fetchStockSummary() {
    try {
      const resp = await getStockSummary();
      if (resp?.status === 200) {
        setSummary({ ...EMPTY_SUMMARY, ...resp.data });
      }
    } catch (error) {
      console.log("Error fetching stock summary:", error);
    }
  }

  async function fetchMetalPrice() {
    try {
      const resp = await getMetalPrice("aluminium");
      // 404 simply means no readings have been recorded yet.
      setMetalPrice(resp?.status === 200 ? resp.data : null);
    } catch (error) {
      console.log("Error fetching metal price:", error);
    }
  }

  async function fetchNews() {
    try {
      const resp = await getNews(3);
      if (resp?.status === 200) {
        setNews(resp.data.news || []);
      }
    } catch (error) {
      console.log("Error fetching news:", error);
    }
  }

  async function fetchExchangeRates() {
    try {
      const resp = await getExchangeRates();
      if (resp?.status === 200) {
        setFx({
          rates: resp.data.rates || [],
          source: resp.data.source,
          asOf: resp.data.asOf,
        });
      }
    } catch (error) {
      console.log("Error fetching exchange rates:", error);
    }
  }

  async function fetchEvents() {
    try {
      const resp = await getEventsByCountry(region ?? "");
      setEvents(resp?.events || []);
    } catch (error) {
      console.log("Error fetching events:", error);
    }
  }

  useEffect(() => {
    fetchStockSummary();
    fetchMetalPrice();
    fetchNews();
    fetchExchangeRates();
  }, []);

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region]);

  const {
    totalOrderWeightKg,
    containerCapacityKg,
    containerPct,
    containerFreeKg,
    weightByBand,
    reorder,
  } = summary;

  const today = new Date();

  // react-big-calendar (Pages/MURCalendar.jsx) puts an event on a day whenever
  // it *overlaps* that day, so an installation that started yesterday and runs
  // through today still sits on today's cell. Test the same overlap here -
  // filtering on `start` alone silently drops multi-day work the calendar is
  // showing.
  const todayTasks = useMemo(() => {
    const dayStart = moment().startOf("day");
    const dayEnd = moment().endOf("day");

    return (events || [])
      .filter((e) => {
        if (!e?.start) return false;
        const start = moment(new Date(e.start));
        const end = e.end ? moment(new Date(e.end)) : start;
        if (!start.isValid() || !end.isValid()) return false;
        if (!start.isSameOrBefore(dayEnd)) return false;
        // An event finishing exactly at 00:00 belongs to the previous day, the
        // one exception being a zero-length event pinned to midnight itself.
        return start.isSame(end)
          ? end.isSameOrAfter(dayStart)
          : end.isAfter(dayStart);
      })
      .sort((a, b) => new Date(a.start) - new Date(b.start));
  }, [events]);

  const completedCount = todayTasks.filter((t) => t.completed).length;
  const remainingCount = todayTasks.length - completedCount;

  // Readings are stored per kilogram; tonnes is a display conversion.
  const aluPrice = metalPrice
    ? priceUnit === "kg"
      ? Number(metalPrice.price).toFixed(2)
      : Math.round(Number(metalPrice.price) * 1000).toLocaleString("en-US")
    : null;
  const aluChange = Number(metalPrice?.changePct) || 0;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "18px", minWidth: 0, maxWidth: "100%" }}>
      {/* Row 1 - headline figures */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "18px" }}>
        <Box sx={cardSx}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
            <Box sx={cardLabelSx}>Aluminium price</Box>
            <Box
              component="select"
              value={priceUnit}
              onChange={(e) => setPriceUnit(e.target.value)}
              sx={{
                border: `1px solid ${COLORS.inputBorder}`,
                borderRadius: "5px",
                padding: "5px 8px",
                fontSize: "12.5px",
                color: COLORS.textSecondary,
                background: "#fff",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="kg">{metalPrice?.currency || "USD"}/kg</option>
              <option value="t">{metalPrice?.currency || "USD"}/tonne</option>
            </Box>
          </Box>

          {metalPrice ? (
            <>
              <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
                <Box>
                  <Box sx={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                    <Box sx={{ fontSize: "38px", fontWeight: 800, color: COLORS.textPrimary, lineHeight: 1 }}>
                      ${aluPrice}
                    </Box>
                    <Box sx={{ fontSize: "17px", color: COLORS.textMuted, fontWeight: 500 }}>
                      / {priceUnit === "kg" ? "kg" : "t"}
                    </Box>
                  </Box>
                  <Box sx={{ fontSize: "13px", color: COLORS.textMuted, marginTop: "8px" }}>
                    {metalPrice.source || "Reference"} reference
                  </Box>
                </Box>
                <Sparkline
                  values={metalPrice.trend || []}
                  color={aluChange < 0 ? "#D22D3A" : COLORS.headerTeal}
                  dots
                  width={210}
                  height={54}
                />
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                <Box sx={{ fontSize: "14.5px", fontWeight: 700, color: aluChange < 0 ? "#D22D3A" : "#1E7E42" }}>
                  {fmtPct(aluChange)} today
                </Box>
                <Box sx={{ fontSize: "12.5px", color: COLORS.textFaint }}>
                  Last {(metalPrice.trend || []).length} readings
                </Box>
              </Box>
            </>
          ) : (
            <Box sx={{ ...emptySx, padding: "18px 0" }}>No price readings recorded yet.</Box>
          )}
        </Box>

        <Box sx={cardSx}>
          <Box sx={cardLabelSx}>Total order weight</Box>
          <Box sx={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
            <Box sx={{ fontSize: "38px", fontWeight: 800, color: COLORS.textPrimary, lineHeight: 1 }}>
              {fmtKg(totalOrderWeightKg)}
            </Box>
            <Box sx={{ fontSize: "17px", color: COLORS.textMuted, fontWeight: 500 }}>kg</Box>
          </Box>
          <Box sx={{ fontSize: "13px", color: COLORS.textMuted }}>Required to reach healthy stock</Box>
        </Box>

        <Box sx={cardSx}>
          <Box sx={cardLabelSx}>20ft container</Box>
          <Box sx={{ fontSize: "38px", fontWeight: 800, color: COLORS.textPrimary, lineHeight: 1 }}>
            {Math.round(containerPct)}% FULL
          </Box>
          <Box sx={{ fontSize: "13px", color: COLORS.textMuted }}>
            {fmtKg(totalOrderWeightKg)} / {fmtKg(containerCapacityKg)} kg
          </Box>
          <Box sx={{ height: "9px", borderRadius: "5px", background: COLORS.rowBorder, overflow: "hidden" }}>
            <Box sx={{ width: `${containerPct}%`, height: "100%", background: COLORS.headerTeal, borderRadius: "5px" }} />
          </Box>
          <Box sx={{ fontSize: "13px", color: COLORS.textMuted }}>{fmtKg(containerFreeKg)} kg available</Box>
        </Box>
      </Box>

      {/* Row 2 - reorder list + today's tasks */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.45fr) minmax(0, 1fr)" }, gap: "18px" }}>
        <Box sx={panelSx}>
          <PanelHeader title="Reorder & critical stock" />
          {reorder.length === 0 && (
            <Box sx={{ ...emptySx, textAlign: "center" }}>Nothing below its reorder point.</Box>
          )}

          {/* Narrow screens get one card per product: the seven columns are
              restacked rather than pushed off the side of the panel. */}
          {isNarrow && reorder.length > 0 && (
            <Box sx={{ padding: { xs: "6px 12px 0", sm: "6px 16px 0" } }}>
              {reorder.slice(0, 6).map((r) => (
                <Box key={r._id} sx={{ padding: "14px 0", borderBottom: `1px solid ${COLORS.rowBorder}` }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "10px" }}>
                    <StatusChip band={r.band} />
                    <Box sx={{ fontSize: "14px", fontWeight: 600, color: COLORS.textPrimary, minWidth: 0, wordBreak: "break-word" }}>
                      {r.productName}
                    </Box>
                    <Box sx={{ fontSize: "12.5px", color: COLORS.textMuted }}>{r.productcode}</Box>
                  </Box>
                  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(64px, 1fr))", gap: "10px" }}>
                    {[
                      { k: "Current", v: r.current, color: (BANDS[r.band] || BANDS.buffer).color },
                      { k: "Healthy", v: r.healthy },
                      { k: "Order qty", v: r.orderQty },
                      { k: "Order kg", v: `${fmtKg(r.orderKg)} kg`, color: COLORS.textPrimary },
                    ].map((cell) => (
                      <Box key={cell.k}>
                        <Box sx={{ fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: COLORS.textFaint }}>
                          {cell.k}
                        </Box>
                        <Box sx={{ fontSize: "14px", fontWeight: 700, color: cell.color || COLORS.textSecondary, marginTop: "3px" }}>
                          {cell.v}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          {!isNarrow && reorder.length > 0 && (
            <Box>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                {/* Fixed widths for the short columns; Product takes the slack,
                    so names wrap at spaces rather than being chopped mid-word. */}
                <colgroup>
                  {REORDER_COLUMNS.map((col) => (
                    <col key={col.key} style={col.width ? { width: col.width } : undefined} />
                  ))}
                </colgroup>
                <thead>
                  <tr style={{ background: "#F7F8F9" }}>
                    {REORDER_COLUMNS.map((col, i) => (
                      <th
                        key={col.key}
                        style={{
                          ...thSx,
                          textAlign: col.align || "left",
                          ...cellEdgePad(i, REORDER_COLUMNS.length),
                        }}
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reorder.slice(0, 6).map((r) => (
                    <tr key={r._id}>
                      {REORDER_COLUMNS.map((col, i) => (
                        <td
                          key={col.key}
                          style={{
                            ...tdSx,
                            textAlign: col.align || "left",
                            ...cellEdgePad(i, REORDER_COLUMNS.length),
                            ...(col.cellSx ? col.cellSx(r) : null),
                          }}
                        >
                          {col.render(r)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          )}
          <Box sx={{ marginTop: "auto", display: "flex", justifyContent: "flex-end", padding: { xs: "14px 14px", sm: "14px 20px" } }}>
            <OutlineButton onClick={() => navigate("/inventory")}>View full order</OutlineButton>
          </Box>
        </Box>

        <Box sx={panelSx}>
          <PanelHeader title="Today's tasks" />
          <Box sx={{ padding: { xs: "16px 14px", sm: "18px 20px" }, display: "flex", gap: { xs: "12px", sm: "18px" }, alignItems: "flex-start" }}>
            <Box
              sx={{
                width: "76px",
                minWidth: "76px",
                border: `1px solid ${COLORS.cardBorder}`,
                borderRadius: "7px",
                overflow: "hidden",
                textAlign: "center",
              }}
            >
              <Box
                sx={{
                  background: COLORS.headerTeal,
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  padding: "5px 0",
                  textTransform: "uppercase",
                }}
              >
                {today.toLocaleDateString("en-GB", { month: "short" })}
              </Box>
              <Box sx={{ fontSize: "30px", fontWeight: 800, color: COLORS.textPrimary, padding: "8px 0 2px", lineHeight: 1 }}>
                {String(today.getDate()).padStart(2, "0")}
              </Box>
              <Box sx={{ fontSize: "11.5px", fontWeight: 700, letterSpacing: "0.1em", color: COLORS.textMuted, paddingBottom: "8px", textTransform: "uppercase" }}>
                {today.toLocaleDateString("en-GB", { weekday: "short" })}
              </Box>
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", marginBottom: "14px" }}>
                <Box sx={{ fontSize: "13.5px", color: COLORS.textMuted }}>
                  <Box component="span" sx={{ color: "#1E7E42", fontWeight: 700 }}>
                    {completedCount} completed
                  </Box>
                  {"  •  "}
                  <Box component="span" sx={{ color: COLORS.textSecondary, fontWeight: 600 }}>
                    {remainingCount} remaining
                  </Box>
                </Box>
                <GhostButton onClick={() => navigate("/calendar")}>Open calendar</GhostButton>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column" }}>
                {todayTasks.map((task, i) => (
                  <Box key={task._id || i} sx={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "8px 0" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: "22px", minWidth: "22px" }}>
                      {task.completed ? (
                        <CheckGlyph />
                      ) : (
                        <Box sx={{ width: "18px", height: "18px", borderRadius: "50%", border: `2px solid ${COLORS.inputBorder}` }} />
                      )}
                    </Box>
                    <Box
                      sx={{
                        background: task.completed ? "#EAF7EE" : "#FFF6E5",
                        color: task.completed ? "#1E7E42" : "#A76A00",
                        border: `1px solid ${task.completed ? "#A9DCB8" : "#F2CE84"}`,
                        borderRadius: "5px",
                        fontSize: "12.5px",
                        fontWeight: 700,
                        padding: "4px 9px",
                        minWidth: "62px",
                        textAlign: "center",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {taskTime(task)}
                    </Box>
                    {/* The panel has vertical room to spare, so wrap long
                        titles over two lines rather than cutting them off. */}
                    <Box
                      sx={{
                        fontSize: "13.5px",
                        color: COLORS.textPrimary,
                        lineHeight: 1.4,
                        minWidth: 0,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {task.title}
                      <Box component="span" sx={{ color: task.completed ? "#1E7E42" : COLORS.textFaint, fontStyle: "italic", marginLeft: "8px" }}>
                        {"— "}
                        {task.completed ? "completed" : "upcoming"}
                      </Box>
                    </Box>
                  </Box>
                ))}
                {todayTasks.length === 0 && (
                  <Box sx={{ ...emptySx, padding: "14px 0" }}>Nothing scheduled for today.</Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Row 3 - news, FX and the order-weight breakdown */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "18px" }}>
        <Box sx={panelSx}>
          <PanelHeader
            title="Daily aluminium news"
            aside={
              news.length > 0 && (
                <Box sx={{ display: "flex", alignItems: "center", gap: "7px", color: "rgba(255,255,255,0.7)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em" }}>
                  {news.length} ITEMS
                  <Box sx={{ width: "8px", height: "8px", borderRadius: "50%", background: "#3FBF6A" }} />
                </Box>
              )
            }
          />
          <Box sx={{ padding: { xs: "6px 14px 0", sm: "6px 20px 0" } }}>
            {news.map((n) => {
              const isOpen = openStory === n._id;
              return (
              <Box
                key={n._id}
                onClick={() => setOpenStory(isOpen ? null : n._id)}
                sx={{
                  display: "flex",
                  gap: "13px",
                  padding: "14px 0",
                  borderBottom: `1px solid ${COLORS.rowBorder}`,
                  cursor: "pointer",
                  "&:hover": { background: COLORS.accentTealTint },
                }}
              >
                <Box sx={{ paddingTop: "2px" }}>
                  <NewsGlyph />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ fontSize: "13.5px", fontWeight: 600, color: COLORS.textPrimary, lineHeight: 1.35 }}>
                    {n.title}
                  </Box>
                  {n.impact ? (
                    <Box sx={{ fontSize: "12.5px", color: COLORS.textMuted, marginTop: "6px" }}>
                      <Box component="span" sx={{ fontWeight: 700 }}>
                        Impact:
                      </Box>{" "}
                      {n.impact}
                    </Box>
                  ) : (
                    n.description && (
                      <Box
                        sx={{
                          fontSize: "12.5px",
                          color: COLORS.textMuted,
                          marginTop: "6px",
                          lineHeight: 1.5,
                          ...(isOpen
                            ? {}
                            : {
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }),
                        }}
                      >
                        {n.description}
                      </Box>
                    )
                  )}
                  <Box sx={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "7px", flexWrap: "wrap", fontSize: "11.5px", color: COLORS.textFaint }}>
                    <span>{fmtDateTime(n.publishedAt)}</span>
                    {n.source && <span>{"•"} {n.source}</span>}
                    {n.category && <span>{"•"} {n.category}</span>}
                    <Box component="span" sx={{ color: COLORS.headerTeal, fontWeight: 600 }}>
                      {"•"} {isOpen ? "Show less" : "Read more"}
                    </Box>
                  </Box>

                  {/* The feed's own link goes to the commodity's price page, so
                      say so rather than dressing it up as the article. */}
                  {isOpen && n.url && (
                    <Box
                      component="a"
                      href={n.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      sx={{
                        display: "inline-block",
                        marginTop: "10px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: COLORS.headerTeal,
                        textDecoration: "none",
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      {n.category || "Trading Economics"} page on Trading Economics {"\u2197"}
                    </Box>
                  )}
                </Box>
              </Box>
              );
            })}
            {news.length === 0 && (
              <Box sx={emptySx}>No aluminium stories in the feed right now.</Box>
            )}
          </Box>
          <Box sx={{ marginTop: "auto", display: "flex", justifyContent: "flex-end", padding: { xs: "14px 14px", sm: "14px 20px" } }}>
            <GhostButton onClick={() => window.open(TE_STREAM_URL, "_blank", "noopener")}>
              View all news
            </GhostButton>
          </Box>
        </Box>

        <Box sx={panelSx}>
          <PanelHeader title="Today's exchange rates" />
          <Box sx={{ padding: { xs: "14px 14px 0", sm: "14px 20px 0" } }}>
            {fx.rates.length > 0 && (
              <Box sx={{ fontSize: "12px", color: COLORS.textFaint, marginBottom: "6px" }}>
                {fx.source || "Indicative"} rates
                {fx.asOf ? ` • ${new Date(fx.asOf).toLocaleDateString("en-GB")}` : ""}
              </Box>
            )}
            {fx.rates.map((rate) => {
              const up = Number(rate.changePct) >= 0;
              return (
                <Box key={rate.pair} sx={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 0", borderBottom: `1px solid ${COLORS.rowBorder}` }}>
                  <Box
                    sx={{
                      width: "28px",
                      height: "28px",
                      minWidth: "28px",
                      borderRadius: "50%",
                      border: `1px solid ${COLORS.cardBorder}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "15px",
                      overflow: "hidden",
                    }}
                  >
                    {CURRENCY_FLAG[rate.base] || rate.base}
                  </Box>
                  <Box sx={{ fontSize: "13px", color: COLORS.textSecondary, fontWeight: 600, minWidth: { xs: "auto", sm: "78px" } }}>
                    {rate.base} / {rate.quote}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0, display: "flex", justifyContent: "center" }}>
                    {!isVeryNarrow && (
                      <Sparkline values={rate.trend || []} color={up ? "#1E7E42" : "#D22D3A"} width={78} height={26} />
                    )}
                  </Box>
                  <Box
                    title={
                      rate.buy && rate.sell
                        ? `Buy Rs ${Number(rate.buy).toFixed(2)} / Sell Rs ${Number(rate.sell).toFixed(2)}`
                        : undefined
                    }
                    sx={{ fontSize: "14px", fontWeight: 700, color: COLORS.textPrimary, whiteSpace: "nowrap" }}
                  >
                    Rs {Number(rate.rate).toFixed(2)}
                  </Box>
                  <Box sx={{ fontSize: "12.5px", fontWeight: 700, color: up ? "#1E7E42" : "#D22D3A", minWidth: { xs: "auto", sm: "46px" }, textAlign: "right" }}>
                    {fmtPct(rate.changePct)}
                  </Box>
                </Box>
              );
            })}
            {fx.rates.length === 0 && <Box sx={emptySx}>No exchange rates recorded yet.</Box>}
          </Box>
          <Box sx={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: { xs: "14px 14px", sm: "14px 20px" } }}>
            <Box sx={{ fontSize: "12px", color: COLORS.textFaint }}>
              {fx.rates.length > 0 ? "Indicative • buy/sell midpoint" : "Indicative"}
            </Box>
            <GhostButton onClick={() => window.open(MCB_RATES_URL, "_blank", "noopener")}>View MCB rates</GhostButton>
          </Box>
        </Box>

        <Box sx={panelSx}>
          <PanelHeader title="Order weight by status" />
          <Box sx={{ padding: { xs: "16px 14px 0", sm: "16px 20px 0" } }}>
            {BAND_ORDER.map((key) => {
              const b = BANDS[key];
              const kg = Number(weightByBand?.[key]) || 0;
              const pct = totalOrderWeightKg ? (kg / totalOrderWeightKg) * 100 : 0;
              return (
                <Box key={key} sx={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 0" }}>
                  <Box sx={{ width: "9px", height: "9px", minWidth: "9px", borderRadius: "50%", background: b.color }} />
                  <Box sx={{ fontSize: "13px", color: COLORS.textSecondary, minWidth: { xs: "auto", sm: "86px" }, whiteSpace: "nowrap" }}>
                    {b.label}
                  </Box>
                  <Box sx={{ fontSize: "13px", fontWeight: 700, color: COLORS.textPrimary, minWidth: { xs: "auto", sm: "62px" }, textAlign: "right", whiteSpace: "nowrap" }}>
                    {fmtKg(kg)} kg
                  </Box>
                  <Box sx={{ flex: 1, minWidth: "32px", height: "11px", background: COLORS.rowBorder, borderRadius: "3px", overflow: "hidden" }}>
                    <Box sx={{ width: `${pct}%`, height: "100%", background: b.color, borderRadius: "3px" }} />
                  </Box>
                  <Box sx={{ fontSize: "12.5px", fontWeight: 600, color: COLORS.textMuted, minWidth: "34px", textAlign: "right" }}>
                    {Math.round(pct)}%
                  </Box>
                </Box>
              );
            })}
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "26px", padding: "10px 0 14px", fontSize: "11.5px", color: COLORS.textFaint, textAlign: "center" }}>
              <Box>
                {fmtKg(totalOrderWeightKg)} kg
                <br />
                Current load
              </Box>
              <Box>
                {fmtKg(containerCapacityKg)} kg
                <br />
                Container max
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              marginTop: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "6px 12px",
              flexWrap: "wrap",
              padding: { xs: "13px 14px", sm: "13px 20px" },
              background: COLORS.groupRowBg,
              borderTop: `1px solid ${COLORS.cardBorder}`,
            }}
          >
            <Box sx={{ fontSize: "12.5px", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: COLORS.textSecondary }}>
              Total
            </Box>
            <Box sx={{ fontSize: "14px", fontWeight: 800, color: COLORS.textPrimary }}>
              {fmtKg(totalOrderWeightKg)} kg
            </Box>
            <Box sx={{ fontSize: "12.5px", color: COLORS.textMuted }}>
              {Math.round(containerPct)}% of {fmtKg(containerCapacityKg)} kg
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DashBoard;
