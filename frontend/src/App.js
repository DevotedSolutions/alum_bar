import { Box } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import LogIn from "./Components/LogIn";
// import ShowProducts from "./Pages/ShowProduct/ShowProducts";

import LayOut from "./layout/LayOut";
import Home from "./Pages/ShowProduct/Home";
import InventoryPage from "./Pages/InventoryPage";
import DashBoard from "./Components/DashBoard";
import AllProducts from "./Components/Products/AllProduct";
import OpenScanner from "./Pages/OpenScanner";
import Signup from "./Components/Signup";

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
          <Route path="/open-scanner" element={<OpenScanner/>} />
          <Route path="/signup" element={<Signup/>} />
        </Route>

      </Routes>

    </Box>
  );
}

export default App;
