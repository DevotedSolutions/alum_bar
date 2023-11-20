import axios from "../BaseUrl";
export const UpdateProducts = async (id,body) => {
    try {
        const response = await axios.put(`updateproducts/${id}`,body,{
            headers: {
              Authorization: `${localStorage.getItem('tokenDevoted')}`, 
            },
          });

        return response;
    } catch (err) {
        return err.response
    }
}