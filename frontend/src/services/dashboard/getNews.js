import axios from "../BaseUrl";

/** Active news items for the dashboard's news column, newest first. */
export const getNews = async (limit = 3) => {
  try {
    const response = await axios.get("/dashboard/news", { params: { limit } });
    return response;
  } catch (err) {
    return err.response;
  }
};
