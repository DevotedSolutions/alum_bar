import React, { useState } from "react";
import { Box, TextField, Button, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { userLogin } from "../services/login";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import CircularProgress from "@mui/material/CircularProgress";
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

function LogIn({ handleLogin }) {
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  const [data, setData] = useState({
    email: "",
    password: "",
    showPassword: false,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };

  const handleShowPassword = () => {
    setData({ ...data, showPassword: !data.showPassword });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const resp = await userLogin(data);

      if (resp) {
        if (resp.status === 200) {
          localStorage.setItem("tokenDesby", resp.data.token);
          localStorage.setItem("UserId", resp.data.userId);
          localStorage.setItem("UserRole", resp.data.role);
          localStorage.setItem("UserName", resp.data.username);
          localStorage.setItem("UserCountry", resp.data.country);
          toast.success(resp.data.message);
          handleLogin();

          navigate(
            resp.data.role === "admin"
              ? "/"
              : resp.data.role === "user"
              ? "/inventory"
              : "/calendar"
          );
          window.location.reload();
        } else {
          toast.error(resp.data.message);
          setLoading(false);
        }
      } else {
        toast.error(resp.data.message);
        setLoading(false);
      }
    } catch (error) {
      toast.error("Check your network connection.");
      setLoading(false);
    }
  };

  return (
    <AuthShell tagline="Operations platform for inventory, job sheets, quotations and team scheduling.">
      <Box sx={{ fontSize: "24px", fontWeight: 800, color: COLORS.textPrimary, marginBottom: "6px" }}>
        Welcome back
      </Box>
      <Box sx={{ fontSize: "14px", color: COLORS.textMuted, marginBottom: "28px" }}>
        Sign in to continue to fermeture
      </Box>

      <form onSubmit={handleSubmit}>
        <TextField
          required
          value={data.email}
          fullWidth
          label="Email"
          name="email"
          onChange={handleChange}
          variant="outlined"
          sx={fieldSx}
        />
        <TextField
          required
          value={data.password}
          fullWidth
          label="Password"
          name="password"
          type={data.showPassword ? "text" : "password"}
          onChange={handleChange}
          variant="outlined"
          sx={fieldSx}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleShowPassword} edge="end" sx={{ color: COLORS.textFaint }}>
                  {data.showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: "flex", alignItems: "center", marginBottom: "22px" }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={handleRememberMeChange}
                sx={{ color: COLORS.inputBorder, "&.Mui-checked": { color: COLORS.headerTeal } }}
              />
            }
            label={<Box sx={{ fontSize: "13.5px", color: COLORS.textSecondary }}>Remember me</Box>}
          />
        </Box>

        <Button type="submit" sx={{ ...buttonSx.primary("46px"), width: "100%", fontSize: "15px" }}>
          {loading ? <CircularProgress sx={{ color: "#fff" }} size="1.4rem" /> : "Log In"}
        </Button>
      </form>
    </AuthShell>
  );
}

export default LogIn;
