import axios from "../BaseUrl";
export const UpdateQuantity = async (id, body) => {
  try {
    const token = localStorage.getItem("tokenDesby");
    const response = await axios.post(`updatequantity/${id}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (err) {
    return err.response;
  }
};
