import axios from "../BaseUrl";

export const deleteNews = async (id) => {
  try {
    const response = await axios.delete(`/dashboard/news/${id}`);
    return response;
  } catch (err) {
    return err.response;
  }
};
