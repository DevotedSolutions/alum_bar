import axios from "../BaseUrl";
export const DecrementProduct = async (id) => {
    try {
        const response = await axios.get(`decrement/${id}`);

        return response;
    } catch (err) {
        return err.response
    }
}