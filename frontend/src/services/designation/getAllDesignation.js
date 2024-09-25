import axios from "../BaseUrl";

export const getAllDesignation = async () => {
  try {
    const response = await axios.get(`/get-designation`);
    return response;
  } catch (err) {
    return err.response;
  }
};

export const getAllQuotations = async () => {
  try {
    const response = await axios.get(`/get-quotations`);
    return response;
  } catch (err) {
    return err.response;
  }
};
