import axios from "../BaseUrl";
export const deleteProducts = async (id) => {
  const token = localStorage.getItem('tokenDevoted');
      const isAdmin = localStorage.getItem('isAdmin');
    try {
        const response = await axios.delete(`deleteproducts/${id}`,{
            headers: {
              Authorization: `${token ? token : isAdmin}`,
            },
          });

        return response;
    } catch (err) {
        return err.response
    }
}