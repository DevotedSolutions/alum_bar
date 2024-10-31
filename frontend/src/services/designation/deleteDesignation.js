import axios from "../BaseUrl";

export const deleteDesignation = async ({ id }) => {
  try {
    const token = localStorage.getItem("tokenDesby");
    const response = await axios.delete(`/delete-designation/${id}`, {
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
