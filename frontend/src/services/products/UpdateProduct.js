import axios from "../BaseUrl";
export const UpdateProducts = async (id,body) => {
    try {
        const response = await axios.put(`updateproducts/${id}`,body);

        return response;
    } catch (err) {
        return err.response
    }
}