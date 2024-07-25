import axios from "../BaseUrl"

export const getPrice = async (id, largeur,hauteur)  => {
   
   
  try {
      const response = await axios.get(`/price?id=${id}&width=${largeur}&height=${hauteur}`);
      return response;
  } catch (err) {
      return err.response
  }
}