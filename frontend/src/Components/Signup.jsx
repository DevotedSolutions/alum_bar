
import React, { useState } from 'react';
import { Box,TextField, FormControl, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { userSignUp } from '../services/SignUp';
import LoginLayout from '../LoginLayout/LoginLayout';
import Typography from '@mui/material/Typography';
import { NavLink } from 'react-router-dom';
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
            navigate("/login")
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
    <LoginLayout title="Welcome to SignUp page">
    <div style={{width:"100%"}}>
    <Box display="flex" justifyContent="center" alignItems="center" sx={{ width: '100%', height: '100vh' }}>
      <ToastContainer/>
      <Box sx={{
        width: '100%',
        maxWidth: '470px',
        height: 'auto',
        borderRadius: '12px',

        padding: '20px',
        background: "#FFFFFF",
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",marginTop:"40px"

      }}>
          <Box>
            <Typography variant="h4" textAlign={"center"}>
            Sign Up
            </Typography>
          </Box>
        <form onSubmit={handleSubmit}>
        <Box my={4}>
            <FormControl fullWidth>
              <TextField
                value={data.username}
                fullWidth
                label="Enter your Username"
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
                label="Enter your email"
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
                label="Enter your password"
                name="password"
                onChange={handleChange}
                variant="outlined"
                style={{ borderRadius: '12px' }}

              />
            </FormControl>
          </Box>
          <Box my={2} sx={{ display: 'flex',gap:"10px"}}>
            <Button type="submit" variant="contained"  sx={{ padding: "10px 30px",width:"100%" }}>
           Sign Up
            </Button>
            {/* <Button onClick={()=>{navigate("/login")}} variant="contained" color="primary" sx={{ padding: "10px 30px" }}>
              Log In
            </Button> */}
          </Box>

        </form>
        <Box sx={{ display: "flex", justifyContent: "center", gap: "6px" }}>
            {" "}
            <Typography>Already have an account?</Typography>
            <NavLink to="/login">Log In</NavLink>
          </Box>
      </Box>
    </Box>
    </div>
    </LoginLayout>
  )
}

export default Signup
