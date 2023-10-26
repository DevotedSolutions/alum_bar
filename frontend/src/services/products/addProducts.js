import axios from "../BaseUrl";
export const addProducts = async (body) => {
    try {
        const response = await axios.post("addproducts",body);

        return response;
    } catch (err) {
        return err.response
    }
}