import axios from "../BaseUrl";

/** Record a new reference-price reading. */
export const addMetalPrice = async (body) => {
  try {
    const response = await axios.post("/dashboard/metal-price", body);
    return response;
  } catch (err) {
    return err.response;
  }
};
