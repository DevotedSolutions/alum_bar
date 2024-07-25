import React from "react";
import NavBar from "../components/NavBar";
import { Box } from "@mui/material";

const LayoutPage = ({ children}) => {
  return (
    <>
      <NavBar  />
      <Box sx={{ mt: "15vh" }}>{children}</Box>
    </>
  );
};

export default LayoutPage;
