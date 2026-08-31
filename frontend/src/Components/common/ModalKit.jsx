import React from "react";
import { Box } from "@mui/material";
import { COLORS } from "../../theme/tokens";

// Shared modal chrome — dark title bar, labeled-field grid, footer button
// bar — matching the Inventory/Products Add/Edit product modal. Every
// add/update modal in the app should build on these instead of inventing
// its own header/field styling.

export const fieldLabelSx = {
  fontSize: "11.5px",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: COLORS.textMuted,
  marginBottom: "6px",
};

export const fieldInputStyle = {
  width: "100%",
  boxSizing: "border-box",
  height: "42px",
  border: `1px solid ${COLORS.inputBorder}`,
  borderRadius: "6px",
  padding: "0 13px",
  fontSize: "14px",
  color: COLORS.textPrimary,
  outline: "none",
};

export const fieldTextareaStyle = {
  ...fieldInputStyle,
  height: "auto",
  padding: "11px 13px",
  resize: "vertical",
};

export const fieldSelectStyle = {
  ...fieldInputStyle,
  padding: "0 11px",
  background: "#fff",
  cursor: "pointer",
};

/** Label + control, stacked, matching the Product modal's field look. */
export const Field = ({ label, children }) => (
  <Box>
    <Box sx={fieldLabelSx}>{label}</Box>
    {children}
  </Box>
);

/** Dark title bar with an uppercase title, optional subtitle, and a close "✕". */
export const ModalHeader = ({ title, subtitle, onClose }) => (
  <Box
    sx={{
      background: COLORS.tableHeaderBg,
      padding: "16px 22px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <Box>
      <Box
        sx={{
          color: "#fff",
          fontSize: "16px",
          fontWeight: 700,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        {title}
      </Box>
      {subtitle && (
        <Box sx={{ color: "#9AA1A9", fontSize: "12.5px", marginTop: "3px" }}>
          {subtitle}
        </Box>
      )}
    </Box>
    <Box
      onClick={onClose}
      sx={{
        width: 34,
        height: 34,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "6px",
        color: "#C7CBD1",
        cursor: "pointer",
        "&:hover": { background: "rgba(255,255,255,0.1)", color: "#fff" },
      }}
    >
      ✕
    </Box>
  </Box>
);

/** sx for the MUI `Modal`'s positioned inner Box (the visible card). */
export const modalShellSx = (width = 840) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  background: "#fff",
  borderRadius: "8px",
  width,
  maxWidth: "94vw",
  maxHeight: "92vh",
  overflowY: "auto",
  boxShadow: "0 26px 60px rgba(0,0,0,0.3)",
});

/** sx for the footer button bar (Cancel / Delete / primary action). */
export const modalFooterSx = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "16px 22px",
  borderTop: `1px solid ${COLORS.rowBorder}`,
  background: "#FAFBFC",
};
