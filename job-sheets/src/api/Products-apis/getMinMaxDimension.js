import axios from "../BaseUrl"

export const getMinMaxDimension = async (id)  => {
   
   console.log(id)
  try {
      const response = await axios.get(`/min-max-dimensions/${id}`);
      return response;
  } catch (err) {
      return err.response
  }
}