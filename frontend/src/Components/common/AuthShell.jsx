import React from "react";
import { Box } from "@mui/material";
import { COLORS } from "../../theme/tokens";
import BrandLogo from "./BrandLogo";

/**
 * Shared split-screen shell for unauthenticated pages (Login, Register,
 * Forgot password): a dark brand panel on the left (hidden on small
 * screens, replaced by a compact brand row inside the card), and a
 * centered white card on the right holding the page's own form content.
 */
const AuthShell = ({ tagline, children, cardMaxWidth = "420px" }) => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", width: "100%", background: COLORS.bodyBg }}>
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "44%",
          minWidth: "420px",
          background: COLORS.sidebarBg,
          padding: "40px",
          boxSizing: "border-box",
        }}
      >
        <BrandLogo size={84} textSize={32} />
        {tagline && (
          <>
            <Box sx={{ width: "56px", height: "2px", background: COLORS.headerTeal, margin: "28px 0" }} />
            <Box sx={{ color: "#9AA1A9", fontSize: "14px", textAlign: "center", maxWidth: "340px", lineHeight: 1.6 }}>
              {tagline}
            </Box>
          </>
        )}
      </Box>

      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <Box
          sx={{
            width: "100%",
            maxWidth: cardMaxWidth,
            background: "#fff",
            border: `1px solid ${COLORS.cardBorder}`,
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(20,26,32,0.05)",
            padding: "36px 34px",
            boxSizing: "border-box",
          }}
        >
          <Box sx={{ display: { xs: "flex", md: "none" }, marginBottom: "26px" }}>
            <BrandLogo size={44} textSize={17} />
          </Box>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AuthShell;
