import React from 'react';
import CustomToolbar from '../Pages/custumTollbar/CustumTolbar';

const LoginLayout = ({ children, title }) => {
  return (
    <div>
      <CustomToolbar title={title} />
      <div>{children}</div>
    </div>
  );
};

export default LoginLayout;