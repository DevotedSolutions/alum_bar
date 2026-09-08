import axios from "../BaseUrl";

export const addNews = async (body) => {
  try {
    const response = await axios.post("/dashboard/news", body);
    return response;
  } catch (err) {
    return err.response;
  }
};
