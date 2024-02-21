
import { Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useState ,useEffect} from "react";
import LogIn from "./Components/LogIn";
// import ShowProducts from "./Pages/ShowProduct/ShowProducts";

import LayOut from "./layout/LayOut";
import Home from "./Pages/ShowProduct/Home";
import InventoryPage from "./Pages/InventoryPage";
import DashBoard from "./Components/DashBoard";
import AllProducts from "./Components/Products/AllProduct";
import OpenScanner from "./Pages/OpenScanner";
import Signup from "./Components/Signup";
import LastWeekSales from "./Components/LastWeekSales";
import ResetPassword from './Components/ResetPassword'
import ForgotPassword from './Components/ForgotPassword'
import { checkTokenExpiration } from "./services/products/getAllProducts";
import AllDesignation from "./Components/admin/AllDesignation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem('tokenDevoted'))
  || Boolean(localStorage.getItem('isAdmin')));

  const [isAdminLogin ,setIsAdminLogin] = useState(Boolean(localStorage.getItem('isAdmin')))


  
 useEffect(()=>{
  checkTokenExpiration();
 },[])
  

  const handleLogin = () => {
    
    setIsLoggedIn(true);

    if(isAdminLogin){
      setIsAdminLogin(true)
    }
  };

  



  console.log(isLoggedIn);
  return (

<>
<ToastContainer/>
    <Routes>

      {isLoggedIn ? (
        <Route element={<LayOut />}>
          <Route index path="/*" element={<DashBoard />} />
          <Route path="/home" element={<Home />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/allproduct" element={<AllProducts/>} />
          <Route path="/open-scanner" element={<OpenScanner />} />
          <Route path="/lastweek" element={<LastWeekSales />} />
         {isAdminLogin && <Route path="/designation" element={<AllDesignation/>}/>}
        </Route>
      ) : (
     
        <Route path="/*" element={<Navigate to="/login" />} />
      )}


      <Route path="/signup" element={<Signup handleLogin={handleLogin} />} />
      <Route path="/login" element={<LogIn handleLogin={handleLogin} admin={setIsAdminLogin} />} />
      <Route path="/forgot-password" element={<ForgotPassword/>} />
      <Route path="/reset-password/:id" element={<ResetPassword  />} />

    </Routes>

    </>
  );
}

export default App;

