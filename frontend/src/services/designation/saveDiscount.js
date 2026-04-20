import axios from "../BaseUrl";

export const getDiscount = async () => {
  try {
    const token = localStorage.getItem("tokenDesby");
    const response = await axios.get(`/get-discount`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.log(error);
  }
};

export const saveDiscount = async (discountData) => {
  try {
    const token = localStorage.getItem("tokenDesby");
    const response = await axios.post(`/save-discount`, discountData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.log(error);
  }
};
