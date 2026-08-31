import React from "react";
import { Box } from "@mui/material";
import { COLORS } from "../../theme/tokens";
import brandMark from "./brand-mark.png";

/**
 * Single source of truth for the brand mark, used in the sidebar and on
 * every unauthenticated page (login/register/forgot password). Swap the
 * placeholder circle+wordmark below for the real logo image in one place
 * to update it everywhere.
 */
const BrandLogo = ({ size = 56, textSize = 19, taglineSize, gap = 11, dark = false, showText = true }) => {
  const tSize = taglineSize || Math.round(textSize * 0.5);
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: `${gap}px` }}>
      <Box
        component="img"
        src={brandMark}
        alt="fermeture"
        sx={{
          width: size,
          height: size,
          minWidth: size,
          borderRadius: "50%",
          display: "block",
        }}
      />
      {showText && (
        <Box>
          <Box sx={{ color: dark ? COLORS.textPrimary : "#fff", fontWeight: 700, fontSize: textSize, lineHeight: 1 }}>
            fermeture
          </Box>
          <Box sx={{ color: dark ? COLORS.textFaint : "#C9CDD3", fontSize: tSize, letterSpacing: "0.12em", marginTop: "4px" }}>
            ALU - PVC - ACIER
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default BrandLogo;
