import axios from "../BaseUrl";
import { jwtDecode } from "jwt-decode";

export function checkTokenExpiration() {
  const token = localStorage.getItem("tokenDevoted");

  if (token) {
    try {
      const decodedToken = jwtDecode(token);

      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("tokenDevoted");
        localStorage.removeItem("UserId");
        console.log("Token has expired. Please log in again.");
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }
}

export const getAllJobSheets = async () => {
  checkTokenExpiration();
  try {
    const token = localStorage.getItem("tokenDevoted");
    const isAdmin = localStorage.getItem("isAdmin");
    const response = await axios.get(`/all-jobsheets`, {
      headers: {
        Authorization: `${token ? token : isAdmin}`,
      },
    });

    return response;
  } catch (err) {
    return err.response;
  }
};

export const addNewJobSheet = async (data) => {
  checkTokenExpiration();
  try {
    const token = localStorage.getItem("tokenDevoted");
    const isAdmin = localStorage.getItem("isAdmin");
    const response = await axios.post(
      `/add-jobsheet`,
      { ...data },
      {
        headers: {
          Authorization: `${token ? token : isAdmin}`,
        },
      }
    );

    return response;
  } catch (err) {
    return err.response;
  }
};

export const deleteJobSheet = async (id) => {
  checkTokenExpiration();
  try {
    const token = localStorage.getItem("tokenDevoted");
    const isAdmin = localStorage.getItem("isAdmin");
    const response = await axios.delete(
      `/delete-jobsheet/${id}`,

      {
        headers: {
          Authorization: `${token ? token : isAdmin}`,
        },
      }
    );

    return response;
  } catch (err) {
    return err.response;
  }
};

export const getJobSheetDetails = async (data) => {
  checkTokenExpiration();
  try {
    const token = localStorage.getItem("tokenDevoted");
    const isAdmin = localStorage.getItem("isAdmin");
    const response = await axios.post(
      `/frappe-pro-acc`,
      { ...data },
      {
        headers: {
          Authorization: `${token ? token : isAdmin}`,
        },
      }
    );

    return response;
  } catch (err) {
    return err.response;
  }
};
