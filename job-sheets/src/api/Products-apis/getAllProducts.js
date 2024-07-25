import axios from "../BaseUrl"

export const getAllProducts = async (page,pageSize) => {
   
   
  try {
      const response = await axios.get(`/get-all-products?page=${page}&size=${pageSize}`);
      return response;
  } catch (err) {
      return err.response
  }
}