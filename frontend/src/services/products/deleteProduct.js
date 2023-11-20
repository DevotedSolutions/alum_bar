import axios from "../BaseUrl";
export const deleteProducts = async (id) => {
    try {
        const response = await axios.delete(`deleteproducts/${id}`,{
            headers: {
              Authorization: `${localStorage.getItem('tokenDevoted')}`, 
            },
          });

        return response;
    } catch (err) {
        return err.response
    }
}