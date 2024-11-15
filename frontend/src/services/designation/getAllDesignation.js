import axios from "../BaseUrl";

export const getAllDesignation = async () => {
  try {
    const token = localStorage.getItem("tokenDesby");
    const response = await axios.get(`/get-designation`, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    return err.response;
  }
};

export const getAllQuotations = async () => {
  try {
    const token = localStorage.getItem("tokenDesby");
    const response = await axios.get(`/get-quotations`, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    return err.response;
  }
};


