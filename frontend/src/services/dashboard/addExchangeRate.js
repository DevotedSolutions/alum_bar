import axios from "../BaseUrl";

export const addExchangeRate = async (body) => {
  try {
    const response = await axios.post("/dashboard/exchange-rates", body);
    return response;
  } catch (err) {
    return err.response;
  }
};
