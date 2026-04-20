import axios from "../BaseUrl";

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
