import React, { useState } from 'react';
import { Box, TextField, FormControl, Button, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { userLogin } from '../services/login';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import LoginLayout from '../LoginLayout/LoginLayout';

function LogIn({handleLogin}) {
  let navigate = useNavigate();

  const [data, setData] = useState({ email: '', password: '', showPassword: false });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };

  const handleShowPassword = () => {
    setData({ ...data, showPassword: !data.showPassword });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const resp = await userLogin(data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokenDevoted')}`
        }
      });

      if (resp) {
        if (resp.status === 200) {
          console.log(resp.data.token);
          localStorage.setItem('tokenDevoted', resp.data.token);
          toast.success(resp.data.message);
          handleLogin();
          navigate("/inventory");
        } else {
          toast.error(resp.data.message);
        }
      } else {
        toast.error(resp.data.message);
      }
    } catch (error) {
      toast.error('Check your network connection.');
    }
  };

  return (
    <LoginLayout title="Welcome to Login page">
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ width: '100%', height: '100vh' }}>
        <ToastContainer />
        <Box sx={{
          width: '100%',
          maxWidth: '550px',
          height: 'auto',
          borderRadius: '12px',
          padding: '20px',
          background: "#FFFFFF",
          boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px"
        }}>
          <form onSubmit={handleSubmit}>
            <Box my={4}>
              <FormControl fullWidth>
                <TextField
                  value={data.email}
                  fullWidth
                  label="Email"
                  name="email"
                  onChange={handleChange}
                  variant="outlined"
                  style={{ borderRadius: '12px' }}
                />
              </FormControl>
            </Box>
            <Box my={4}>
              <FormControl fullWidth>
                <TextField
                  value={data.password}
                  fullWidth
                  label="Password"
                  name="password"
                  type={data.showPassword ? 'text' : 'password'}
                  onChange={handleChange}
                  variant="outlined"
                  style={{ borderRadius: '12px' }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleShowPassword}
                          edge="end"
                        >
                          {data.showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
            </Box>
            <Box my={2} sx={{ display: 'flex' }}>
              <Button type="submit" variant="contained" color="primary" sx={{ padding: "10px 30px" }}>
                Log In
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </LoginLayout>
  );
}

export default LogIn;
