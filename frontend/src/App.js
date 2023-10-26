import { Box } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import LogIn from "./Components/LogIn";
// import ShowProducts from "./Pages/ShowProduct/ShowProducts";

import LayOut from "./layout/LayOut";
import Home from "./Pages/ShowProduct/Home";
import InventoryPage from "./Pages/InventoryPage";
import DashBoard from "./Components/DashBoard";
import AllProducts from "./Components/Products/AllProduct";

function App() {




  return (
    <Box>

      <Routes>

        <Route element={<LayOut />}>
          <Route index path="/" element={<DashBoard />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<LogIn />} />

          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/allproduct" element={<AllProducts />} />
        </Route>

      </Routes>


    </Box>
  );
}

export default App;
