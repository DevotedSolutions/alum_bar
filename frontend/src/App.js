import { Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LogIn from "./Components/LogIn";
import "./App.css";
// import ShowProducts from "./Pages/ShowProduct/ShowProducts";

import LayOut from "./layout/LayOut";
import Home from "./Pages/ShowProduct/Home";
import InventoryPage from "./Pages/InventoryPage";
import DashBoard from "./Components/DashBoard";
import AllProducts from "./Components/Products/AllProduct";
import OpenScanner from "./Pages/OpenScanner";
import Signup from "./Components/Signup";
import LastWeekSales from "./Components/LastWeekSales";
import ResetPassword from "./Components/ResetPassword";
import ForgotPassword from "./Components/ForgotPassword";
import { checkTokenExpiration } from "./services/products/getAllProducts";
import AllDesignation from "./Components/admin/AllDesignation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JobSheet from "./Pages/JobSheet";
import JobSheetDetails from "./Pages/JobSheetDetail";
import JobSheetList from "./Pages/JobSheetList";
import QuotationExport from "./Pages/QuotationExport";
import UserManagement from "./Pages/UserManagement";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("tokenDesby"))
  );

  const [isAdminLogin, setIsAdminLogin] = useState(
    localStorage.getItem("UserRole") === "admin"
  );

  useEffect(() => {
    checkTokenExpiration();
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);

    if (isAdminLogin) {
      setIsAdminLogin(true);
    }
  };

  return (
    <>
      <ToastContainer />
      <Routes>
        {isLoggedIn ? (
          <Route element={<LayOut />}>
            <Route index path="/" element={<DashBoard />} />
            <Route path="/home" element={<Home />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/allproduct" element={<AllProducts />} />
            <Route path="/open-scanner" element={<OpenScanner />} />
            <Route path="/lastweek" element={<LastWeekSales />} />

            {isAdminLogin && (
              <Route path="/designation" element={<AllDesignation />} />
            )}
            {isAdminLogin && (
              <Route path="/quotation-export" element={<QuotationExport />} />
            )}
            {isAdminLogin && (
              <Route path="/users" element={<UserManagement />} />
            )}
            {isAdminLogin && <Route path="/jobsheets" element={<JobSheet />} />}
            {isAdminLogin && (
              <Route path="/jobsheets/:id" element={<JobSheetList />} />
            )}
            {isAdminLogin && (
              <Route
                path="/jobsheets/:id/:sheetID"
                element={<JobSheetDetails />}
              />
            )}

            <Route path="/*" element={<Navigate to="/" />} />
          </Route>
        ) : (
          <Route path="/*" element={<Navigate to="/login" />} />
        )}

        <Route path="/signup" element={<Signup handleLogin={handleLogin} />} />
        <Route
          path="/login"
          element={<LogIn handleLogin={handleLogin} admin={setIsAdminLogin} />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:id" element={<ResetPassword />} />
      </Routes>
    </>
  );
}

export default App;
