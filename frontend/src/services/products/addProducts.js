import axios from "../BaseUrl";
export const addProducts = async (body) => {
  const token = localStorage.getItem("tokenDesby");
  try {
    const response = await axios.post("addproducts", body, {
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
