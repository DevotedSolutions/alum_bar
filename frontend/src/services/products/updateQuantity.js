import axios from "../BaseUrl";
export const UpdateQuantity = async (id,body) => {
    try {
        const response = await axios.post(`updatequantity/${id}`,body);

        return response;
    } catch (err) {
        return err.response
    }
}