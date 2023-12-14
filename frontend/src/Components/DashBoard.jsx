import {
  Grid,
  Typography,
  Box,
  Table,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
} from "@mui/material";

import React, { useEffect, useState } from "react";

import {
  totalProducts,
  lowStockProducts,
  mostStockProducts,
  topRatedProducts,

} from "../services/products/totalProducts";

import LastWeekSales from "./LastWeekSales";
import TotalRevenu from "./Products/totalRevenue";
const DashBoard = () => {
  const [total, setTotal] = useState(0);
  const [lowStock, setLowStock] = useState(0);
  const [mostStock, setMostStock] = useState(0);
  const [topRtdProducts, setTopRatedProducts] = useState([]);
  


 
  const products = [
    { id: 1, name: "Product 1", code: "ABC123", quantity: 10 },
    { id: 2, name: "Product 2", code: "BB789", quantity: 20 },
    { id: 2, name: "Product 2", code: "CC789", quantity: 20 },
    { id: 2, name: "Product 2", code: "CC789", quantity: 20 },
  ];

  async function fetchTotalproducts() {
    try {
      const resp = await totalProducts();
      if (resp.status === 200) {
        setTotal(resp.data.totalProducts);
      }
    } catch (error) {
      console.log("Error fetching total products:", error);
    }
  }
  async function fetchLowStockProducts() {
    try {
      const resp = await lowStockProducts();
      if (resp.status === 200) {
        setLowStock(resp.data.lowStockProductsCount);
        // console.log(resp.data.lowStockProductsCount, "ressssssssssssssss");
      }
    } catch (error) {
      console.log("Error occur in fetching Low stock products:", error);
    }
  }

  async function fetchMostStockProducts() {
    try {
      const resp = await mostStockProducts();
      if (resp.status === 200) {
        setMostStock(resp.data.mostStockProductsCount);
        // console.log(resp.data.mostStockProductsCount, "moststockkkkkkkkkkk");
      }
    } catch (error) {
      console.log("Error occur in fetching Most stock products:", error);
    }
  }
  async function fetchTopRatedProducts() {
    try {
      const resp = await topRatedProducts();
      if (resp.status === 200) {
        setTopRatedProducts(resp.data.topRatedProducts);
       
        console.log(topRtdProducts,"ttttttttttttttt");
      }
    } catch (error) {
      console.log("Error occur in fetching top rated products:", error);
    }
  }


  useEffect(() => {
    fetchTotalproducts();
    fetchLowStockProducts();
    fetchMostStockProducts();
    fetchTopRatedProducts();

  }, []);


  return (
    <Grid container>
      <Grid item xs={12} sx={{ padding: "0 15px" }}>
        <Typography sx={{ padding: "4px 0" }} variant="h5">
          Dashboard
        </Typography>
        <Grid container gap={"4px"} justifyContent={"space-between"}>
          <Grid
            item
            xs={12}
            sm={2.85}
            sx={{
              borderRadius: "12px",
              padding: "25px 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",

              boxShadow:
                " rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
              background: "#434343",
              color:"white"
            }}
          >
         
            <Typography variant="h6" textAlign={"center"}>
              Total Products
            </Typography>
            <Typography variant="h6" textAlign={"center"}>
              {total}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={2.85}
            sx={{
              borderRadius: "12px",
              padding: "10px 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "#454545",
              color:"white",
              boxShadow:
                " rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",

            }}
          >
           
            <Typography variant="h6" textAlign={"center"}>
              This Month Sales
            </Typography>
            <Typography variant="h6" textAlign={"center"}>
              $300
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={2.85}
            sx={{
              padding: "10px 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow:
                " rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
              borderRadius: "12px",
              background: "#565656",
              color:"white"
            }}
          >
           
            <Typography variant="h6" textAlign={"center"}>
              Low stock Products
            </Typography>
            <Typography variant="h6" textAlign={"center"}>
              {lowStock}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={2.85}
            sx={{
              padding: "10px 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow:
                " rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
              borderRadius: "12px",
              background: "#878787",
              color:"white"
            }}
          >
           
            <Typography variant="h6" textAlign={"center"}>
              Most Stock Products
            </Typography>
            <Typography variant="h6" textAlign={"center"}>
              {mostStock}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      {/* container 2  for top rated products and top sales*/}

      <Grid item xs={12} mt={2} sx={{ padding: "0 15px" }}>
        <Grid container gap={"2px"} justifyContent={"space-between"}>
          <Grid item xs={12} sm={12} md={5.9} sx={{}}>
            <Typography variant="h6">Top 5 Rated Products</Typography>
            <Box
              sx={{
                boxShadow:
                  " rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
                borderRadius: "12px",
                padding: "20px 10px",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ padding: "5px" }}>Product Name</TableCell>
                    <TableCell sx={{ padding: "5px" }}>Product Code</TableCell>
                    <TableCell sx={{ padding: "5px" }}>Quantity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topRtdProducts.map((product) => {
                    console.log(product,"pppppppppp");
                   return <TableRow key={product.id}>
                      <TableCell sx={{ padding: "8px" }}>
                        {product.productName}
                      </TableCell>
                      <TableCell sx={{ padding: "8px" }}>
                        {product.productcode}
                      </TableCell>
                      <TableCell sx={{ padding: "8px" }}>
                        {product.quantity}
                      </TableCell>
                    </TableRow>
})}
                </TableBody>
              </Table>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={5.9}>
            <Typography variant="h6">Top Sales Products</Typography>

            <Box
              sx={{
                boxShadow:
                  " rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
                borderRadius: "12px",
                padding: "20px 10px",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ padding: "5px" }}>Product Name</TableCell>
                    <TableCell sx={{ padding: "5px" }}>Product Code</TableCell>
                    <TableCell sx={{ padding: "5px" }}>Quantity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topRtdProducts.map((product) => {
                    console.log(product,"pppppppppp");
                   return <TableRow key={product.id}>
                      <TableCell sx={{ padding: "8px" }}>
                        {product.productName}
                      </TableCell>
                      <TableCell sx={{ padding: "8px" }}>
                        {product.productcode}
                      </TableCell>
                      <TableCell sx={{ padding: "8px" }}>
                        {product.quantity}
                      </TableCell>
                    </TableRow>
})}
                </TableBody>
              </Table>
            </Box>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} mt={2} sx={{ padding: "0 15px" }}>
        <Grid
          container
          justifyContent={"space-between"}
        
        >
        
          <Grid
            item
            xs={12}
            sm={12}
            md={5.9}
            sx={{
           
            }}
            mb={3}
          >
            <Typography variant="h6">Last week sales</Typography>
            
            <LastWeekSales />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={5.9}
            sx={{
            }}
            mb={3}
          >
              <Typography variant="h6">Total Revenue</Typography>
            <TotalRevenu />
          </Grid>
        </Grid>
      </Grid>
  
    </Grid>
  );
};

export default DashBoard;
