
import React, { useState } from 'react';
import { Box, Typography, TextField, FormControl, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { userSignUp } from '../services/SignUp';
const Signup = () => {
    let navigate=useNavigate()

    const [data, setData] = useState({username:" ", email: '', password: '' });

    const handleChange = (event) => {
      const { name, value } = event.target;
      setData({ ...data, [name]: value });
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      console.log(data);
      try {
        const resp = await userSignUp(data);
  
        if (resp) {
          if (resp.status === 200) {
            
        
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
    <div style={{width:"100%"}}>
    <Box display="flex" justifyContent="center" alignItems="center" sx={{ width: '100%', height: '84vh' }}>
      <ToastContainer/>
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
                value={data.username}
                fullWidth
                label="UserName"
                name="username"
                onChange={handleChange}
                variant="outlined"
                style={{ borderRadius: '12px' }}
              />
            </FormControl>
          </Box>
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
          <Box my={2} sx={{ display: 'flex',gap:"10px"}}>
            <Button type="submit" variant="contained" color="primary" sx={{ padding: "10px 30px" }}>
           Sign Up
            </Button>
            <Button onClick={()=>{navigate("/login")}} variant="contained" color="primary" sx={{ padding: "10px 30px" }}>
              Log In
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
    </div>
  )
}

export default Signup
