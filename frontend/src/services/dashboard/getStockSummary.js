import axios from "../BaseUrl";

/** Reorder list, restock weight and container fill, computed by the backend. */
export const getStockSummary = async (limit) => {
  try {
    const response = await axios.get("/dashboard/stock-summary", {
      params: limit ? { limit } : undefined,
    });
    return response;
  } catch (err) {
    return err.response;
  }
};
