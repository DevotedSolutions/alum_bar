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
  topSalesProducts,
  getTotalRevenue,
  getLastweekSales,
} from "../services/products/totalProducts";
import { topSoldProducts } from "../services/products/totalProducts";

import LastWeekSales from "./LastWeekSales";
import TotalRevenu from "./Products/totalRevenue";
const DashBoard = () => {
  const [total, setTotal] = useState(0);
  const [lowStock, setLowStock] = useState(0);
  const [mostStock, setMostStock] = useState(0);
  const [topRtdProducts, setTopRatedProducts] = useState([]);
  const [topSaleProducts, setTopSaleProducts] = useState([]);
  const [topSoldProductss, setTopSoldProducts] = useState([]);
  const [monthlySale, setMonthlySale] = useState(0);
  const [yearRevenue, setYearRevenue] = useState([]);
  const [lastWeek, setLastWeek] = useState();
  const [countday, setCountDay] = useState();

  const YearsaleArray=[]
 
 
  yearRevenue.map((item,i)=>{
    // console.log(item.total,"iiii");
    YearsaleArray.push(item.total)
    return  item

  })


  // console.log(YearsaleArray,"years sale array");
  



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
      }
    } catch (error) {
      console.log("Error occur in fetching top rated products:", error);
    }
  }
  async function fetchTopSalesProducts() {
    try {
      const resp = await topSalesProducts();
      if (resp.status === 200) {
        setTopSaleProducts(resp.data.topSales);
        // console.log(resp.data.topSales, "resssssssssssssssp");

      }
    } catch (error) {
      console.log("Error occur in fetching top sales products:", error);
    }
  }
  async function fetchTopSoldProducts() {
    try {
      const resp = await topSoldProducts();
      if (resp.status === 200) {
        // console.log(resp.data.topSales,"rrrrrrrrrrrrrrr");
        setTopSoldProducts(resp.data.topSales);
        // console.log(resp.data.topSales, "resssssssssssssssp");

      }
    } catch (error) {
      console.log("Error occur in fetching top sold products:", error);
    }
  }
  async function fetchTotalRevenue() {
    try {
      const resp = await getTotalRevenue();
      if (resp.status === 200) {
        setMonthlySale(resp.data.currentMonthSales.total)
        // console.log(resp.data, "resp revenue");
        // console.log(resp.data.monthlySales, "resp total revenue");
        setYearRevenue(resp.data.monthlySales)

      }
    } catch (error) {
      console.log("Error occur in fetching total revenue of products:", error);
    }
  
  }
  async function LastWeekSale() {
    try {
      const resp = await getLastweekSales();
      if (resp.status === 200) {

        const lastWeekSales = resp.data.lastWeekSales;
        const countsArray = lastWeekSales.map((item) => item.count);
        const countsDay = lastWeekSales.map((item) => item.day);
        console.log(countsDay,"kkkkkkkkkkkkkkkkk");
        
        setLastWeek(countsArray)
        setCountDay(countsDay)

      }
    } catch (error) {
      console.log("Error occur in fetching last week sales of products:", error);
    }
  
  }
  useEffect(() => {
    fetchTotalproducts();
    fetchLowStockProducts();
    fetchMostStockProducts();
    fetchTopRatedProducts();
    fetchTopSalesProducts();
    fetchTotalRevenue();
    fetchTopSoldProducts();
    LastWeekSale()
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
              color: "white",
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
              color: "white",
              boxShadow:
                " rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
            }}
          >
            <Typography variant="h6" textAlign={"center"}>
              This Month Sales
            </Typography>
            <Typography variant="h6" textAlign={"center"}>
              ${monthlySale}
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
              color: "white",
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
              color: "white",
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
        <Grid item xs={12} sm={12} md={5.9}>
            <Typography variant="h6">Top 5 Revenue Products</Typography>

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
                    <TableCell sx={{ padding: "5px" }}>Revenue</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topSoldProductss.map((product) => {
                    // console.log(product, " singlepppppppppp");
                    // console.log(product.productDetails, "product details");
                    return (
                      <TableRow key={product.productDetails._id}>
                        <TableCell sx={{ padding: "8px" }}>
                          {product.productDetails.productName}
                        </TableCell>
                        <TableCell sx={{ padding: "8px" }}>
                        {product.productDetails.productcode}
                        </TableCell>
                        <TableCell sx={{ padding: "8px" }}>
                          {product.totalQuantity}
                        </TableCell>
                        <TableCell sx={{ padding: "8px" }}>
                          ${product.totalRevenue}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={12} md={5.9}>
            <Typography variant="h6">Top 5 Sold Products</Typography>

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
                    <TableCell sx={{ padding: "5px" }}>Revenue</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topSaleProducts.map((product) => {
                    // console.log(product, " singlepppppppppp");
                    // console.log(product.productDetails, "product details");
                    return (
                      <TableRow key={product.productDetails._id}>
                        <TableCell sx={{ padding: "8px" }}>
                          {product.productDetails.productName}
                        </TableCell>
                        <TableCell sx={{ padding: "8px" }}>
                        {product.productDetails.productcode}
                        </TableCell>
                        <TableCell sx={{ padding: "8px" }}>
                          {product.totalQuantity}
                        </TableCell>
                        <TableCell sx={{ padding: "8px" }}>
                          ${product.totalRevenue}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} mt={2} sx={{ padding: "0 15px" }}>
        <Grid container justifyContent={"space-between"}>
          <Grid item xs={12} sm={12} md={5.9} sx={{}} mb={3}>
            <Typography variant="h6">Last week sales</Typography>

            <LastWeekSales lastWeek={lastWeek} countday={countday}/>
          </Grid>
          <Grid item xs={12} sm={12} md={5.9} sx={{}} mb={3}>
            <Typography variant="h6">Total Revenue</Typography>
            <TotalRevenu yearData={YearsaleArray}/>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DashBoard;
