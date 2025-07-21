import axios from "../BaseUrl";
import { jwtDecode } from "jwt-decode";

export function checkTokenExpiration() {
  const token = localStorage.getItem("tokenDesby");

  if (token) {
    try {
      const decodedToken = jwtDecode(token);

      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("tokenDesby");
        localStorage.removeItem("UserId");
        return "expired";
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }
}

export const getAllProducts = async () => {
  try {
    const token = localStorage.getItem("tokenDesby");
    const response = await axios.get(`/getproducts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (err) {
    return err.response;
  }
};
export const getOneProduct = async (id) => {
  try {
    const token = localStorage.getItem("tokenDesby");
    const response = await axios.get(`getoneproduct/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (err) {
    return err.response;
  }
};
export const getQrcode = async (id) => {
  const token = localStorage.getItem("tokenDesby");
  try {
    const response = await axios.get(`getqrcode/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (err) {
    return err.response;
  }
};

export const sellProduct = async (id, quantity) => {
  const token = localStorage.getItem("tokenDesby");
  const userId = localStorage.getItem("UserId");
  try {
    const response = await axios.get(
      `/decrement/${id}/${quantity}?userId=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (err) {
    return err.response;
  }
};

export function sortProducts(data) {
  return data.sort((a, b) => {
    const aCategory = a?.productCategory || "";
    const bCategory = b?.productCategory || "";

    const aIsProfile = aCategory.toLowerCase() === "profiles";
    const bIsProfile = bCategory.toLowerCase() === "profiles";

    if (aIsProfile && !bIsProfile) return -1;
    if (!aIsProfile && bIsProfile) return 1;

    if (!aIsProfile && !bIsProfile) {
      return aCategory.localeCompare(bCategory);
    }
  });
}
