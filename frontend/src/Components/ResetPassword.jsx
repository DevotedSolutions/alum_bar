import React, { useState } from 'react';
import { Box, TextField, FormControl, Button, InputAdornment, IconButton, Typography } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import LoginLayout from '../LoginLayout/LoginLayout';

function ResetPassword({ handleLogin }) {
  let navigate = useNavigate();

  const [data, setData] = useState({ Password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(data);
    // Add your password update logic here
    // Example: call an API to update the password

    // try {
    //   const resp = await userLogin(data, {
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem('tokenDevoted')}`
    //     }
    //   });

    //   if (resp) {
    //     if (resp.status === 200) {
    //       console.log(resp.data.token);
    //       localStorage.setItem('tokenDevoted', resp.data.token);
    //       toast.success(resp.data.message);
    //       handleLogin();
    //       navigate("/inventory");
    //     } else {
    //       toast.error(resp.data.message);
    //     }
    //   } else {
    //     toast.error(resp.data.message);
    //   }
    // } catch (error) {
    //   toast.error('Check your network connection.');
    // }
  };

  return (
    <LoginLayout title="Create a new Password">
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
          <Typography variant='h6'>Update Password</Typography>
          <form onSubmit={handleSubmit}>
            <Box my={4}>
              <FormControl fullWidth>
                <TextField
                  value={data.Password}
                  fullWidth
                  label="Password"
                  name="Password"
                  type={showPassword ? 'text' : 'password'}
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
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
            </Box>
            <Box my={2} sx={{ display: 'flex' }}>
              <Button type="submit" variant="contained" color="primary" sx={{ padding: "10px 30px" }}>
                Update Password
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </LoginLayout>
  );
}

export default ResetPassword;
