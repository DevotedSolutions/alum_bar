import axios from "../BaseUrl";
export const totalProducts = async () => {
    try {
        const response = await axios.get("/getTotal")
        return response;
    } catch (err) {
        return err.response
    }
}
export const lowStockProducts = async () => {
    try {
        const response = await axios.get("/lowstock")
        return response;
    } catch (err) {
        return err.response
    }
}
export const mostStockProducts = async () => {
    try {
        const response = await axios.get("/mostproduct")
        return response;
    } catch (err) {
        return err.response
    }
}
export const topRatedProducts = async () => {
    try {
        const response = await axios.get("/top-rated")
        return response;
    } catch (err) {
        return err.response
    }
}
export const getTotalRevenue = async () => {
    try {
        const response = await axios.get("/totalrevenue")
        return response;
    } catch (err) {
        return err.response
    }
}