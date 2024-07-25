import React, { useState } from 'react';
import { Box, TextField, FormControl, Button } from '@mui/material';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { NavLink, useNavigate } from 'react-router-dom';
import LoginLayout from '../LoginLayout/LoginLayout';
import Typography from '@mui/material/Typography';

function ForgotPassword({handleLogin}) {
  // let navigate = useNavigate();

  const [data, setData] = useState({ email: ''});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };



  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(data);
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
    <LoginLayout title="Forget Your  Password">
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
              <Typography variant='h6'>Forgot Password </Typography>
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
            
         
            <Box my={2} sx={{ display: 'flex' }}>
              <Button type="submit" variant="contained" color="primary" sx={{ padding: "10px 30px" }}>
             Send
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </LoginLayout>
  );
}

export default ForgotPassword;
