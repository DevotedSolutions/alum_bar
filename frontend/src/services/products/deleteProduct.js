import axios from "../BaseUrl";
export const deleteProducts = async (id) => {
  const token = localStorage.getItem("tokenDesby");
  try {
    const response = await axios.delete(`deleteproducts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (err) {
    return err.response;
  }
};
