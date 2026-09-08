import axios from "../BaseUrl";

/** Latest reference price for a metal plus the readings behind its sparkline. */
export const getMetalPrice = async (metal = "aluminium", points) => {
  try {
    const response = await axios.get("/dashboard/metal-price", {
      params: { metal, ...(points ? { points } : {}) },
    });
    return response;
  } catch (err) {
    return err.response;
  }
};
