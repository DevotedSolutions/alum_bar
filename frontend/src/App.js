import { Route, Routes, useNavigate } from "react-router-dom";
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
import MurCalendar from "./Pages/MURCalendar";
import LeavesManagement from "./Pages/Leaves";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("tokenDesby"))
  );

  const navigate = useNavigate();

  const theme = createTheme({
    palette: {
      primary: {
        main: "#08999D",
      },
    },
  });

  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem("UserRole") === "admin" ||
      localStorage.getItem("UserRole")?.includes("admin")
  );

  const [isInventoryUser, setIsInventoryUser] = useState(
    localStorage.getItem("UserRole") === "user" ||
      localStorage.getItem("UserRole")?.includes("user")
  );

  const [isStaff, setIsStaff] = useState(
    localStorage.getItem("UserRole") === "staff" ||
      localStorage.getItem("UserRole")?.includes("staff")
  );

  useEffect(() => {
    const isExpired = checkTokenExpiration();
    if (isExpired === "expired") {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(Boolean(localStorage.getItem("tokenDesby")));
      setIsAdmin(
        localStorage.getItem("UserRole") === "admin" ||
          localStorage.getItem("UserRole")?.includes("admin")
      );
      setIsInventoryUser(
        localStorage.getItem("UserRole") === "user" ||
          localStorage.getItem("UserRole")?.includes("user")
      );
      setIsStaff(
        localStorage.getItem("UserRole") === "staff" ||
          localStorage.getItem("UserRole")?.includes("staff")
      );
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    // window.location.reload();
  };

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer />
      <Routes>
        {isLoggedIn ? (
          <Route element={<LayOut />}>
            {isAdmin && (
              <>
                <Route path="/dashboard" element={<DashBoard />} />
                <Route path="/home" element={<Home />} />
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/allproduct" element={<AllProducts />} />
                <Route path="/open-scanner" element={<OpenScanner />} />
                <Route path="/lastweek" element={<LastWeekSales />} />
                <Route path="/calendar" element={<MurCalendar />} />
                <Route path="/leaves" element={<LeavesManagement />} />
                <Route path="/designation" element={<AllDesignation />} />
                <Route path="/quotation-export" element={<QuotationExport />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/jobsheets" element={<JobSheet />} />
                <Route path="/jobsheets/:id" element={<JobSheetList />} />
                <Route
                  path="/jobsheets/:id/:sheetID"
                  element={<JobSheetDetails />}
                />
              </>
            )}

            {isInventoryUser && (
              <>
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/open-scanner" element={<OpenScanner />} />
              </>
            )}

            {isStaff && (
              <>
                <Route path="/calendar" element={<MurCalendar />} />
                <Route path="/leaves" element={<LeavesManagement />} />
              </>
            )}

            <Route
              path="/*"
              element={
                <Navigate
                  to={
                    isAdmin
                      ? "/calendar"
                      : isInventoryUser
                      ? "/inventory"
                      : "/calendar"
                  }
                />
              }
            />
          </Route>
        ) : (
          <Route path="/*" element={<Navigate to="/login" />} />
        )}

        <Route path="/signup" element={<Signup handleLogin={handleLogin} />} />
        <Route path="/login" element={<LogIn handleLogin={handleLogin} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:id" element={<ResetPassword />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
