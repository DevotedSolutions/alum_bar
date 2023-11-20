import axios from "../BaseUrl";
export const getAllProducts = async (page,size) => {
    try {
        const response = await axios.get(`/getproducts?page=${page}&size=${size}`,{
            headers: {
              Authorization: `${localStorage.getItem('tokenDevoted')}`, 
            },
          });

        return response;
    } catch (err) {
        return err.response
    }
}
export const getOneProduct = async (id) => {
    try {
        const response = await axios.get(`getoneproduct/${id}`);

        return response;
    } catch (err) {
        return err.response
    }
}
export const getQrcode = async (id) => {
    try {
        const response = await axios.get(`getqrcode/${id}`);

        return response;
    } catch (err) {
        return err.response
    }
}