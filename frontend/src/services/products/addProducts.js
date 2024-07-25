import axios from "../BaseUrl";
export const addProducts = async (body) => {
  const token = localStorage.getItem('tokenDevoted');
      const isAdmin = localStorage.getItem('isAdmin');
    try {
        const response = await axios.post("addproducts",body,{
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `${token ? token : isAdmin}`,
            },
          });

        return response;
    } catch (err) {
        return err.response
    }
}