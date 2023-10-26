import { Outlet } from "react-router-dom"
import { Box } from "@mui/material";
import DrawerAppBar from "../Components/NavBar"


const LayOut = () => {
    return (
        <Box sx={{
            width:"100%",
             display: "flex", 
             marginTop: "80px" }}>
         <DrawerAppBar />
          <Outlet />
        </Box>
    )
}

export default LayOut
