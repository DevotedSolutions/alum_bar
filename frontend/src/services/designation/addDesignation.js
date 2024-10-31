import axios from "../BaseUrl";

export const addDesignation = async ({ formDataAppend }) => {
  try {
    const token = localStorage.getItem("tokenDesby");
    const response = await axios.post(`/add-designation`, formDataAppend, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.log(error);
  }
};
