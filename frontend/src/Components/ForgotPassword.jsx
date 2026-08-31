import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { NavLink } from "react-router-dom";
import { COLORS, buttonSx } from "../theme/tokens";
import AuthShell from "./common/AuthShell";

const fieldSx = {
  marginBottom: "26px",
  "& .MuiOutlinedInput-root": {
    borderRadius: "6px",
    "& fieldset": { borderColor: COLORS.inputBorder },
    "&:hover fieldset": { borderColor: COLORS.headerTeal },
    "&.Mui-focused fieldset": { borderColor: COLORS.headerTeal },
  },
};

function ForgotPassword({ handleLogin }) {
  const [data, setData] = useState({ email: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(data);
  };

  return (
    <AuthShell tagline="Operations platform for inventory, job sheets, quotations and team scheduling.">
      <Box sx={{ fontSize: "24px", fontWeight: 800, color: COLORS.textPrimary, marginBottom: "6px" }}>
        Forgot password
      </Box>
      <Box sx={{ fontSize: "14px", color: COLORS.textMuted, marginBottom: "28px" }}>
        Enter your email and we&apos;ll send you reset instructions
      </Box>

      <form onSubmit={handleSubmit}>
        <TextField
          value={data.email}
          fullWidth
          label="Email"
          name="email"
          onChange={handleChange}
          variant="outlined"
          sx={fieldSx}
        />

        <Button type="submit" sx={{ ...buttonSx.primary("46px"), width: "100%", fontSize: "15px" }}>
          Send
        </Button>
      </form>

      <Box sx={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "22px", fontSize: "13.5px" }}>
        <Box sx={{ color: COLORS.textMuted }}>Remembered it?</Box>
        <NavLink to="/login" style={{ color: COLORS.headerTeal, fontWeight: 600, textDecoration: "none" }}>
          Log In
        </NavLink>
      </Box>
    </AuthShell>
  );
}

export default ForgotPassword;
