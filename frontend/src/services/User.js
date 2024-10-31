import axios from "./BaseUrl";

export const getUsers = async () => {
  try {
    const token = localStorage.getItem("tokenDesby");
    const response = await axios.get("/getUsers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }); // Make sure this endpoint matches your server API
    return response.data; // Returning the data portion directly
  } catch (err) {
    return err.response;
  }
};

export const updateUser = async (userId, body) => {
  try {
    const token = localStorage.getItem("tokenDesby");
    const response = await axios.put(`/user/${userId}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response; // Return the updated user data
  } catch (err) {
    return err.response;
  }
};

export const deleteUser = async (userId) => {
  try {
    const token = localStorage.getItem("tokenDesby");
    const response = await axios.delete(`/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    return err.response;
  }
};
