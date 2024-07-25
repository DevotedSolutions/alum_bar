import axios from "../BaseUrl"

export const getGamme = async ()  => {
   
   
  try {
      const response = await axios.get(`/get-all-gamme`);
      return response;
  } catch (err) {
      return err.response
  }
}