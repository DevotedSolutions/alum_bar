import axios from "./BaseUrl";

export const getEventsByCountry = async (country) => {
  try {
    const token = localStorage.getItem("tokenDesby");
    const response = await axios.get(`/getEventsByCountry/${country}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    return err.response;
  }
};

export const getMarkersByCountry = async (country) => {
  try {
    const token = localStorage.getItem("tokenDesby");
    const response = await axios.get(`/getMarkersByCountry/${country}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    return err.response;
  }
};

export const addEventByCountry = async (body) => {
  try {
    const token = localStorage.getItem("tokenDesby");
    const response = await axios.post(`/addEventByCountry`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    return err.response;
  }
};

export const deleteEvent = async (eventId) => {
  try {
    const token = localStorage.getItem("tokenDesby");
    const response = await axios.delete(`/deleteEvent/${eventId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    return err.response;
  }
};

export const deleteLeave = async (eventId) => {
  try {
    const token = localStorage.getItem("tokenDesby");
    const response = await axios.delete(`/deleteLeave/${eventId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    return err.response;
  }
};

export const updateEvent = async (body) => {
  try {
    const token = localStorage.getItem("tokenDesby");
    const response = await axios.post(`/updateEvent`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    return err.response;
  }
};

export const completeEvent = async (eventId) => {
  try {
    const token = localStorage.getItem("tokenDesby");
    const response = await axios.post(
      `/completeEvent`,
      { _id: eventId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    return err.response;
  }
};

export const getLeaves = async (body) => {
  try {
    const token = localStorage.getItem("tokenDesby");
    const response = await axios.post(`/getLeaves`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    return err.response;
  }
};

export const addLeave = async (body) => {
  try {
    const token = localStorage.getItem("tokenDesby");
    const response = await axios.post(`/addLeave`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    return err.response;
  }
};

export const editLeave = async (body) => {
  try {
    const token = localStorage.getItem("tokenDesby");
    const response = await axios.post(`/editLeave`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    return err.response;
  }
};

export const getRemainingLeaves = async (body) => {
  try {
    const token = localStorage.getItem("tokenDesby");
    const response = await axios.post(`/getRemainingLeaves`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    return err.response;
  }
};
