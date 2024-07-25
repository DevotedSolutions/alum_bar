import axios from "../BaseUrl";
import {checkTokenExpiration} from './getAllProducts';
export const UpdateProducts = async (id,body) => {
  const token = localStorage.getItem('tokenDevoted');
      const isAdmin = localStorage.getItem('isAdmin');

  checkTokenExpiration();
    try {
        const response = await axios.put(`updateproducts/${id}`,body,{
            headers: {
              Authorization: `${token ? token : isAdmin}`,
            },
          });

        return response;
    } catch (err) {
        return err.response
    }
}