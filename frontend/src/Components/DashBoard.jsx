import { Box } from "@mui/material";

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
import { COLORS } from "../theme/tokens";

const kpiCardSx = (accent) => ({
  background: "#fff",
  border: `1px solid ${COLORS.cardBorder}`,
  borderTop: `3px solid ${accent}`,
  borderRadius: "8px",
  padding: "18px 20px",
  display: "flex",
  flexDirection: "column",
  gap: "9px",
  boxShadow: "0 1px 3px rgba(20,26,32,0.05)",
});

const panelHeaderSx = {
  background: COLORS.tableHeaderBg,
  padding: "15px 20px",
};

const panelSx = {
  background: "#fff",
  border: `1px solid ${COLORS.cardBorder}`,
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 1px 3px rgba(20,26,32,0.05)",
};

const tableHeadRow = (
  <tr style={{ background: "#F7F8F9" }}>
    {["Product name", "Product code", "Quantity", "Revenue"].map((h) => (
      <th
        key={h}
        style={{
          padding: "12px 20px",
          textAlign: "left",
          fontSize: "11.5px",
          fontWeight: 700,
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          color: COLORS.textMuted,
          borderBottom: `1px solid ${COLORS.cardBorder}`,
        }}
      >
        {h}
      </th>
    ))}
  </tr>
);

const ProductRow = ({ product }) => (
  <tr>
    <td style={{ padding: "12px 20px", borderBottom: `1px solid ${COLORS.rowBorder}`, fontSize: "13.5px", fontWeight: 600, color: COLORS.textPrimary }}>
      {product.productDetails.productName}
    </td>
    <td style={{ padding: "12px 20px", borderBottom: `1px solid ${COLORS.rowBorder}`, fontSize: "13px", color: COLORS.textSecondary }}>
      {product.productDetails.productcode}
    </td>
    <td style={{ padding: "12px 20px", borderBottom: `1px solid ${COLORS.rowBorder}`, fontSize: "13.5px", color: COLORS.textSecondary }}>
      {product.totalQuantity}
    </td>
    <td style={{ padding: "12px 20px", borderBottom: `1px solid ${COLORS.rowBorder}`, fontSize: "13.5px", fontWeight: 700, color: COLORS.textPrimary }}>
      ${product.totalRevenue}
    </td>
  </tr>
);

const DashBoard = () => {
  const [total, setTotal] = useState(0);
  const [lowStock, setLowStock] = useState(0);
  const [mostStock, setMostStock] = useState(0);
  const [topSaleProducts, setTopSaleProducts] = useState([]);
  const [topSoldProductss, setTopSoldProducts] = useState([]);
  const [monthlySale, setMonthlySale] = useState(0);
  const [yearRevenue, setYearRevenue] = useState([]);
  const [lastWeek, setLastWeek] = useState();
  const [countday, setCountDay] = useState();

  const YearsaleArray = [];

  yearRevenue.map((item, i) => {
    YearsaleArray.push(item.total);
    return item;
  });

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
      }
    } catch (error) {
      console.log("Error occur in fetching Most stock products:", error);
    }
  }
  async function fetchTopRatedProducts() {
    try {
      const resp = await topRatedProducts();
      if (resp.status !== 200) {
        console.log("Error occur in fetching top rated products");
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
      }
    } catch (error) {
      console.log("Error occur in fetching top sales products:", error);
    }
  }
  async function fetchTopSoldProducts() {
    try {
      const resp = await topSoldProducts();
      if (resp.status === 200) {
        setTopSoldProducts(resp.data.topSales);
      }
    } catch (error) {
      console.log("Error occur in fetching top sold products:", error);
    }
  }
  async function fetchTotalRevenue() {
    try {
      const resp = await getTotalRevenue();
      if (resp.status === 200) {
        setMonthlySale(resp.data.currentMonthSales.total);
        setYearRevenue(resp.data.monthlySales);
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

        setLastWeek(countsArray);
        setCountDay(countsDay);
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
    LastWeekSale();
  }, []);

  const kpis = [
    { label: "Total products", value: total, accent: COLORS.headerTeal, valueColor: COLORS.textPrimary, note: "Tracked in the catalogue" },
    { label: "This month sales", value: `$${monthlySale}`, accent: COLORS.headerTeal, valueColor: COLORS.textPrimary, note: "Revenue this calendar month" },
    { label: "Low stock products", value: lowStock, accent: "#D22D3A", valueColor: "#D22D3A", note: "Below their reorder point" },
    { label: "Most stock products", value: mostStock, accent: COLORS.headerTeal, valueColor: COLORS.textPrimary, note: "Best-stocked items" },
  ];

  return (
    <Box>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "18px", marginBottom: "22px" }}>
        {kpis.map((k) => (
          <Box key={k.label} sx={kpiCardSx(k.accent)}>
            <Box sx={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: COLORS.textFaint }}>
              {k.label}
            </Box>
            <Box sx={{ fontSize: "30px", fontWeight: 800, color: k.valueColor, lineHeight: 1 }}>
              {k.value}
            </Box>
            <Box sx={{ fontSize: "12.5px", color: COLORS.textMuted }}>{k.note}</Box>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "18px", marginBottom: "18px" }}>
        <Box sx={panelSx}>
          <Box sx={panelHeaderSx}>
            <span style={{ color: "#fff", fontSize: "14px", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" }}>
              Top 5 revenue products
            </span>
          </Box>
          <Box sx={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>{tableHeadRow}</thead>
              <tbody>
                {topSoldProductss.map((product) => (
                  <ProductRow key={product.productDetails._id} product={product} />
                ))}
              </tbody>
            </table>
          </Box>
        </Box>

        <Box sx={panelSx}>
          <Box sx={panelHeaderSx}>
            <span style={{ color: "#fff", fontSize: "14px", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" }}>
              Top 5 sold products
            </span>
          </Box>
          <Box sx={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>{tableHeadRow}</thead>
              <tbody>
                {topSaleProducts.map((product) => (
                  <ProductRow key={product.productDetails._id} product={product} />
                ))}
              </tbody>
            </table>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "18px" }}>
        <Box sx={panelSx}>
          <Box sx={panelHeaderSx}>
            <span style={{ color: "#fff", fontSize: "14px", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" }}>
              Last week sales
            </span>
          </Box>
          <Box sx={{ padding: "16px" }}>
            <LastWeekSales lastWeek={lastWeek} countday={countday} />
          </Box>
        </Box>
        <Box sx={panelSx}>
          <Box sx={panelHeaderSx}>
            <span style={{ color: "#fff", fontSize: "14px", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" }}>
              Total revenue
            </span>
          </Box>
          <Box sx={{ padding: "16px" }}>
            <TotalRevenu yearData={YearsaleArray} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DashBoard;
