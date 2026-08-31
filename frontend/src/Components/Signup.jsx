import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { userSignUp } from "../services/SignUp";
import { NavLink } from "react-router-dom";
import { COLORS, buttonSx } from "../theme/tokens";
import AuthShell from "./common/AuthShell";

const fieldSx = {
  marginBottom: "18px",
  "& .MuiOutlinedInput-root": {
    borderRadius: "6px",
    "& fieldset": { borderColor: COLORS.inputBorder },
    "&:hover fieldset": { borderColor: COLORS.headerTeal },
    "&.Mui-focused fieldset": { borderColor: COLORS.headerTeal },
  },
};

const Signup = () => {
  let navigate = useNavigate();

  const [data, setData] = useState({ username: " ", email: "", password: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const resp = await userSignUp(data);

      if (resp) {
        if (resp.status === 200) {
          toast.success(resp.data.message);
          navigate("/login");
        } else {
          toast.error(resp.data.message);
        }
      } else {
        toast.error(resp.data.message);
      }
    } catch (error) {
      toast.error("check your network connection.");
    }
  };

  return (
    <AuthShell tagline="Operations platform for inventory, job sheets, quotations and team scheduling.">
      <Box sx={{ fontSize: "24px", fontWeight: 800, color: COLORS.textPrimary, marginBottom: "6px" }}>
        Create an account
      </Box>
      <Box sx={{ fontSize: "14px", color: COLORS.textMuted, marginBottom: "28px" }}>
        Sign up to get started with fermeture
      </Box>

      <form onSubmit={handleSubmit}>
        <TextField
          value={data.username}
          fullWidth
          label="Username"
          name="username"
          onChange={handleChange}
          variant="outlined"
          sx={fieldSx}
        />
        <TextField
          value={data.email}
          fullWidth
          label="Email"
          name="email"
          onChange={handleChange}
          variant="outlined"
          sx={fieldSx}
        />
        <TextField
          value={data.password}
          fullWidth
          label="Password"
          name="password"
          type="password"
          onChange={handleChange}
          variant="outlined"
          sx={{ ...fieldSx, marginBottom: "26px" }}
        />

        <Button type="submit" sx={{ ...buttonSx.primary("46px"), width: "100%", fontSize: "15px" }}>
          Sign Up
        </Button>
      </form>

      <Box sx={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "22px", fontSize: "13.5px" }}>
        <Box sx={{ color: COLORS.textMuted }}>Already have an account?</Box>
        <NavLink to="/login" style={{ color: COLORS.headerTeal, fontWeight: 600, textDecoration: "none" }}>
          Log In
        </NavLink>
      </Box>
    </AuthShell>
  );
};

export default Signup;
