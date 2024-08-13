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

export const getFrappeJobSheets = async (sheetID) => {
  checkTokenExpiration();
  try {
    const token = localStorage.getItem("tokenDevoted");
    const isAdmin = localStorage.getItem("isAdmin");
    const response = await axios.get(`/frappejs/${sheetID}`, {
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

export const deleteSheet = async (type, id) => {
  checkTokenExpiration();
  try {
    const token = localStorage.getItem("tokenDevoted");
    const isAdmin = localStorage.getItem("isAdmin");
    const response = await axios.delete(
      `/delete-jobsheet/${type}/${id}`,

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

export const getFrappeSheetByID = async (id) => {
  checkTokenExpiration();
  try {
    const token = localStorage.getItem("tokenDevoted");
    const isAdmin = localStorage.getItem("isAdmin");
    const response = await axios.get(`/onefrappejs/${id}`, {
      headers: {
        Authorization: `${token ? token : isAdmin}`,
      },
    });

    return response;
  } catch (err) {
    return err.response;
  }
};

export const addNewFrappeJS = async (data) => {
  checkTokenExpiration();
  try {
    const token = localStorage.getItem("tokenDevoted");
    const isAdmin = localStorage.getItem("isAdmin");
    const response = await axios.post(
      `/add-frappejs`,
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

export const updateFrappeJS = async (data) => {
  checkTokenExpiration();
  try {
    const token = localStorage.getItem("tokenDevoted");
    const isAdmin = localStorage.getItem("isAdmin");
    const response = await axios.post(
      `/update-frappejs`,
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

export const getSumFrappeJS = async (id) => {
  checkTokenExpiration();
  try {
    const token = localStorage.getItem("tokenDevoted");
    const isAdmin = localStorage.getItem("isAdmin");
    const response = await axios.get(`/sum-frappejs/${id}`, {
      headers: {
        Authorization: `${token ? token : isAdmin}`,
      },
    });

    return response;
  } catch (err) {
    return err.response;
  }
};

export const createFrappeExcel = async (id) => {
  checkTokenExpiration();
  try {
    const token = localStorage.getItem("tokenDevoted");
    const isAdmin = localStorage.getItem("isAdmin");
    const response = await axios.get(`/export-to-excel/${id}`, {
      headers: {
        Authorization: `${token ? token : isAdmin}`,
      },
    });

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

export const GetSheetOptimization = async (data) => {
  checkTokenExpiration();
  try {
    const token = localStorage.getItem("tokenDevoted");
    const isAdmin = localStorage.getItem("isAdmin");
    const response = await axios.post(
      `/optimizeProfile`,
      {
        profiles: [...data],
      },
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
