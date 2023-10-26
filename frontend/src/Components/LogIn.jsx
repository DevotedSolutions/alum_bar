import React, { useState } from 'react';
import { Box, Typography, TextField, FormControl, Button } from '@mui/material';
import { userLogin } from '../services/login';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function LogIn() {
  const [data, setData] = useState({ email: '', password: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
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
        }
        else {
          toast.error(resp.data.message);
        }
      } else {
        toast.error(resp.data.message);
      }
    } catch (error) {

      toast.error('check your network connection.');
    }

   

  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" sx={{ width: '100%', height: '100vh' }}>
      <ToastContainer />
      <Box sx={{
        width: '100%',
        maxWidth: '550px',
        height: '270px',
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
                label="password"
                name="password"
                onChange={handleChange}
                variant="outlined"
                style={{ borderRadius: '12px' }}

              />
            </FormControl>
          </Box>
          <Box my={2} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button type="submit" variant="contained" color="primary" sx={{ padding: "10px 30px" }}>
              Log In
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
}

export default LogIn;
