import axios from "../BaseUrl";
import {jwtDecode }from 'jwt-decode';


export function checkTokenExpiration() {
    const token = localStorage.getItem('tokenDevoted');
  
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
  
        if (decodedToken.exp * 1000 < Date.now()) {
          localStorage.removeItem('tokenDevoted');
          localStorage.removeItem('UserId')
          console.log('Token has expired. Please log in again.');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }
  

export const getAllProducts = async () => {
   
     
      checkTokenExpiration();
    try {

      const token = localStorage.getItem('tokenDevoted');
      const isAdmin = localStorage.getItem('isAdmin');
        const response = await axios.get(`/getproducts`,{
            headers: {
              Authorization: `${token ? token : isAdmin}`,
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

export const sellProduct= async (id,quantity) =>{
  const userId = localStorage.getItem("UserId");
  try {
      const response = await axios.get(`/decrement/${id}/${quantity}?userId=${userId}`);

      return response;
  } catch (err) {
      return err.response
  }



}