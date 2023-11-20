import axios from "../BaseUrl";
export const addProducts = async (body) => {
    try {
        const response = await axios.post("addproducts",body,{
            headers: {
                'Content-Type': 'multipart/form-data',
              Authorization: `${localStorage.getItem('tokenDevoted')}`, 
            },
          });

        return response;
    } catch (err) {
        return err.response
    }
}