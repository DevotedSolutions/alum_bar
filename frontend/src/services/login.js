
import axios from "./BaseUrl";
export const userLogin = async (body) => {
    try {
        const response = await axios.post("/login", body);

        return response;
    } catch (err) {
        return err.response
    }
}