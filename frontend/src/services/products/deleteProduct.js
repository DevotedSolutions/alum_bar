import axios from "../BaseUrl";
export const deleteProducts = async (id) => {
    try {
        const response = await axios.delete(`deleteproducts/${id}`);

        return response;
    } catch (err) {
        return err.response
    }
}