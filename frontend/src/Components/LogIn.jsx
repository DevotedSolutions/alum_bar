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
    
      const resp = await userLogin(data,{
        headers: {
            Authorization: `Bearer ${localStorage.getItem('tokenDevoted')}`
          }
      });
      if (resp.status === 200) {

        console.log(resp.data.token);
        localStorage.setItem('tokenDevoted',resp.data.token );
        
        toast.success(resp.data.message);
      } else {
        toast.error(resp.data.message);
      }
   
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" sx={{ width: '100%', height: '100vh' }}>
      <ToastContainer />
      <Box sx={{ width: '100%', maxWidth: '600px', height: '300px', borderRadius: '12px', border: '1px solid black', padding: '20px' }}>
        <form onSubmit={handleSubmit}>
          <Box mb={4}>
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
          <Box sx={{ margin: '4px 0' }}>
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
          <Box mt={5} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button type="submit" variant="contained" color="primary">
              Log In
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
}

export default LogIn;
