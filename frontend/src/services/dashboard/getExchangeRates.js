import axios from "../BaseUrl";

/** Latest rate per currency pair, with trend and day-on-day change. */
export const getExchangeRates = async (points) => {
  try {
    const response = await axios.get("/dashboard/exchange-rates", {
      params: points ? { points } : undefined,
    });
    return response;
  } catch (err) {
    return err.response;
  }
};
