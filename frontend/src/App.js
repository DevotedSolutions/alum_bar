
import { Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useState } from "react";
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

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    // Logic to handle user login, set isLoggedIn to true
    setIsLoggedIn(true);
  };
  console.log(isLoggedIn);
  return (


    <Routes>

      {isLoggedIn ? (
        <Route element={<LayOut />}>
          <Route index path="/" element={<DashBoard />} />
          <Route path="/home" element={<Home />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/allproduct" element={<AllProducts />} />
          <Route path="/open-scanner" element={<OpenScanner />} />
        </Route>
      ) : (
        // Redirect to login if not logged in
        <Route path="/*" element={<Navigate to="/login" />} />
      )}


      <Route path="/signup" element={<Signup handleLogin={handleLogin} />} />
      <Route path="/login" element={<LogIn handleLogin={handleLogin} />} />

    </Routes>


  );
}

export default App;
