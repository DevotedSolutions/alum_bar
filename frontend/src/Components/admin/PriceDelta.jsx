import React from "react";
import { Box } from "@mui/material";

// Small "was X (+Y%)" caption shown under a price field so an admin can
// compare the new price against the pre-increase reference before saving.
const PriceDelta = ({ oldValue, newValue }) => {
  const oldNum = Number(oldValue);
  const newNum = Number(newValue);

  if (!oldNum || Number.isNaN(oldNum) || Number.isNaN(newNum)) return null;

  const delta = ((newNum - oldNum) / oldNum) * 100;
  const changed = Math.round(newNum) !== Math.round(oldNum);

  return (
    <Box
      sx={{
        fontSize: "11px",
        lineHeight: 1.4,
        marginTop: "3px",
        color: !changed
          ? "text.secondary"
          : delta >= 0
            ? "#1B7A3D"
            : "#C62828",
        fontWeight: changed ? 600 : 400,
      }}
    >
      was {oldNum}
      {changed ? ` (${delta >= 0 ? "+" : ""}${delta.toFixed(1)}%)` : " (no change)"}
    </Box>
  );
};

export default PriceDelta;
