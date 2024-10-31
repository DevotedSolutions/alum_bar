import axios from "../BaseUrl";
import { checkTokenExpiration } from "./getAllProducts";
export const UpdateProducts = async (id, body) => {
  const token = localStorage.getItem("tokenDesby");

  checkTokenExpiration();
  try {
    const response = await axios.put(`updateproducts/${id}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (err) {
    return err.response;
  }
};
