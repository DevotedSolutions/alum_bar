import React from "react";
import { Box } from "@mui/material";
import { COLORS } from "../../theme/tokens";
import { ChevronLeftIcon, ChevronRightIcon } from "../common/navIcons";

const VIEW_LABELS = { month: "Month", week: "Week", day: "Day", agenda: "Agenda" };

/**
 * Custom react-big-calendar toolbar, restyled to match the redesign's
 * dark toolbar bar (Today/Back/Next, centered label, view switcher).
 * Receives { date, view, views, label, onNavigate, onView } from
 * react-big-calendar — state/navigation stays entirely calendar-managed,
 * this only changes the rendering.
 */
const CalendarToolbar = ({ label, view, views, onNavigate, onView }) => {
  const viewList = Array.isArray(views) ? views : Object.keys(views || VIEW_LABELS);

  return (
    <Box
      sx={{
        background: COLORS.tableHeaderBg,
        borderRadius: "8px 8px 0 0",
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        flexWrap: "wrap",
      }}
    >
      <Box sx={{ display: "flex", gap: "10px" }}>
        <Box
          component="button"
          onClick={() => onNavigate("TODAY")}
          sx={{ height: "38px", background: COLORS.headerTeal, color: "#fff", border: "none", borderRadius: "5px", padding: "0 18px", fontSize: "13.5px", fontWeight: 600, cursor: "pointer", "&:hover": { background: COLORS.headerTealHover } }}
        >
          Today
        </Box>
        <Box
          component="button"
          onClick={() => onNavigate("PREV")}
          sx={{ height: "38px", display: "flex", alignItems: "center", gap: "8px", background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.35)", borderRadius: "5px", padding: "0 16px", fontSize: "13.5px", cursor: "pointer", "&:hover": { background: "rgba(255,255,255,0.09)" } }}
        >
          <ChevronLeftIcon size={14} />
          Back
        </Box>
        <Box
          component="button"
          onClick={() => onNavigate("NEXT")}
          sx={{ height: "38px", display: "flex", alignItems: "center", gap: "8px", background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.35)", borderRadius: "5px", padding: "0 16px", fontSize: "13.5px", cursor: "pointer", "&:hover": { background: "rgba(255,255,255,0.09)" } }}
        >
          Next
          <ChevronRightIcon size={14} />
        </Box>
      </Box>

      <Box sx={{ color: "#fff", fontSize: "17px", fontWeight: 500 }}>{label}</Box>

      <Box sx={{ display: "flex", border: "1px solid rgba(255,255,255,0.35)", borderRadius: "5px", overflow: "hidden" }}>
        {viewList.map((v) => (
          <Box
            key={v}
            component="button"
            onClick={() => onView(v)}
            sx={{
              padding: "9px 18px",
              fontSize: "13.5px",
              cursor: "pointer",
              border: "none",
              color: view === v ? "#fff" : "#D6DAE0",
              background: view === v ? COLORS.headerTeal : "transparent",
            }}
          >
            {VIEW_LABELS[v] || v}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CalendarToolbar;
