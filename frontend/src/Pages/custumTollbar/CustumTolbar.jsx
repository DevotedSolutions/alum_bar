import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const CustomToolbar = ({ title }) => {
  return (

    <AppBar >
      <Toolbar>
        <Typography variant="h6">{title}</Typography>
        
      </Toolbar>
    </AppBar>
  );
};

export default CustomToolbar;
