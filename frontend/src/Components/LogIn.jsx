import React, { useState } from "react";
import {
  Box,
  TextField,
  FormControl,
  Button,
  InputAdornment,
  IconButton,
  Typography,
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { userLogin } from "../services/login";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavLink, useNavigate } from "react-router-dom";
import LoginLayout from "../LoginLayout/LoginLayout";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import CircularProgress from '@mui/material/CircularProgress';


function LogIn({ handleLogin }) {
  const [loading,setLoading]=useState(false)
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
    setLoading(true)
    try {
      const resp = await userLogin(data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tokenDevoted")}`,
        },
      });

      if (resp) {
        if (resp.status === 200) {
          console.log(resp.data.token);
          localStorage.setItem("tokenDevoted", resp.data.token);
          toast.success(resp.data.message);
          handleLogin();
         
          navigate("/Dashboard");
        } else {
          toast.error(resp.data.message);
          setLoading(false)
        }
      } else {
        toast.error(resp.data.message);
        setLoading(false)
      }
    } catch (error) {
      toast.error("Check your network connection.");
      setLoading(false)
    }
  };

  return (
    <LoginLayout title="Welcome to Login page">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ width: "100%", height: {xs:"70vh",sm:"85vh"},padding:"10px" }}
      >
        <ToastContainer />
        <Box
          sx={{
            width: "100%",
            maxWidth: "470px",
            height: "auto",
            borderRadius: "12px",
            padding: "20px",
            background: "#FFFFFF",
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          }}
        >
          <Box>
            <Typography variant="h4" textAlign={"center"}>
              Log In
            </Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            <Box my={3}>
              <FormControl fullWidth>
                <TextField
                required
                  value={data.email}
                  fullWidth
                  label="Enter your email"
                  name="email"
                  onChange={handleChange}
                  variant="outlined"
                  style={{ borderRadius: "12px" }}
                />
              </FormControl>
            </Box>
            <Box my={4}>
              <FormControl fullWidth>
                <TextField
                required
                  value={data.password}
                  fullWidth
                  label="Enter your password"
                  name="password"
                  type={data.showPassword ? "text" : "password"}
                  onChange={handleChange}
                  variant="outlined"
                  style={{ borderRadius: "12px" }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleShowPassword} edge="end">
                          {data.showPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
              <Box
                mt={1}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={rememberMe}
                        onChange={handleRememberMeChange}
                      />
                    }
                    label="Remember Me"
                  />
                </Box>
                <NavLink to="/forgot-password">Forgot Password</NavLink>
              </Box>
            </Box>

            <Box my={2} sx={{ display: "flex" }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ width: "100%", padding: "10px 30px" }}
              >  
              {
                loading?<CircularProgress style={{'color': 'white'}} size="1.5rem"/>:"Log In"
              }
              
         
              </Button>
            </Box>
          </form>
          <Box sx={{ display: "flex", justifyContent: "center", gap: "6px" }}>
          
            <Typography>Don't have an account?</Typography>
            <NavLink to="/signup">Register</NavLink>
          </Box>
        </Box>
      </Box>
    </LoginLayout>
  );
}

export default LogIn;
