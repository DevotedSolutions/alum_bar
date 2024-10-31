import axios from "../BaseUrl";
import { checkTokenExpiration } from "./getAllProducts";
export const totalProducts = async () => {
  checkTokenExpiration();
  try {
    const token = localStorage.getItem("tokenDesby");
    const response = await axios.get("/getTotal", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    return err.response;
  }
};
export const lowStockProducts = async () => {
  try {
    const token = localStorage.getItem("tokenDesby");
    const response = await axios.get("/lowstock", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    return err.response;
  }
};
export const mostStockProducts = async () => {
  try {
    const token = localStorage.getItem("tokenDesby");
    const response = await axios.get("/mostproduct", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    return err.response;
  }
};
export const topRatedProducts = async () => {
  try {
    const token = localStorage.getItem("tokenDesby");
    const response = await axios.get("/top-rated", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    return err.response;
  }
};
export const topSalesProducts = async () => {
  try {
    const token = localStorage.getItem("tokenDesby");
    const response = await axios.get("/top-sales", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    return err.response;
  }
};
export const topSoldProducts = async () => {
  try {
    const token = localStorage.getItem("tokenDesby");
    const response = await axios.get("/top-sold", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    return err.response;
  }
};
export const getTotalRevenue = async () => {
  try {
    const token = localStorage.getItem("tokenDesby");
    const response = await axios.get("/totalrevenue", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    return err.response;
  }
};
export const getLastweekSales = async () => {
  try {
    const token = localStorage.getItem("tokenDesby");
    const response = await axios.get("/last-week-sales", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    return err.response;
  }
};
