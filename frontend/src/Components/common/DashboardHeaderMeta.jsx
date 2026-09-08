// Right-hand side of the teal page header on /dashboard only: today's date
// and the time the page last pulled its figures, matching the dashboard
// design mockup. Purely informational - it renders no controls.

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";

const DATE_FMT = {
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
};

const CalendarGlyph = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const RefreshGlyph = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-2.64-6.36" />
    <polyline points="21 3 21 9 15 9" />
  </svg>
);

export default function DashboardHeaderMeta({ updatedAt }) {
  const [now, setNow] = useState(new Date());

  // Keep the clock honest without re-rendering the whole header constantly.
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  const stamp = updatedAt || now;

  return (
    <Box
      sx={{
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "7px",
        color: "#fff",
        whiteSpace: "nowrap",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: "9px", fontSize: "14px", fontWeight: 600 }}>
        <CalendarGlyph />
        <span>{now.toLocaleDateString("en-GB", DATE_FMT)}</span>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: "9px", fontSize: "13.5px", color: "rgba(255,255,255,0.88)" }}>
        <RefreshGlyph />
        <span>
          Updated{" "}
          {stamp.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </Box>
    </Box>
  );
}
