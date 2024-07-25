import "./App.css";
import AllProducts from "./components/Products/AllProducts";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes } from "react-router-dom";
import PdfDocument from "./components/Cart/PdfDocument";
import { PDFViewer } from "@react-pdf/renderer";
import { useState } from "react";


function App() {
  

  
 
const cartItems = localStorage.getItem('cartItems')

const array = JSON.parse(cartItems)
const [clientDetails, setClientDetails] = useState({
  nomClient: "",
  tel: "",
  email: "",
  mesureFinale: false,
});
const generateRandomQuotation = () => {
  return Math.floor(Math.random() * 9000) + 1000;
};

  return (
    <>
      <ToastContainer />
      {/* <AllProducts /> */}
      <Routes>
   
            <Route path="/" element={<AllProducts/>} />
            <Route path='/pdf-file' element={
              <PDFViewer  style={{width:'100%',height:"100vh"}}>
            <PdfDocument cartItems={array} clientDetails={clientDetails} quotation={generateRandomQuotation()} />
            </PDFViewer>}/>
      
      </Routes>
    </>
  );
}

export default App;
