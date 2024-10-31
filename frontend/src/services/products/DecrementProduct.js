import axios from "../BaseUrl";
export const DecrementProduct = async (id) => {
  const token = localStorage.getItem("tokenDesby");
  try {
    const response = await axios.get(`decrement/${id}`, {
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
