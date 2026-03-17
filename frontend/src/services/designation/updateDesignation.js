import axios from "../BaseUrl";

export const updateDesignation = async ({ formDataAppend, id }) => {
  try {
    const token = localStorage.getItem("tokenDesby");
    const response = await axios.put(
      `/update-designation/${id}`,
      formDataAppend,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response;
  } catch (error) {
    console.log(error);
  }
};

export const updateCombo = async ({ formDataAppend, id }) => {
  try {
    const token = localStorage.getItem("tokenDesby");
    const response = await axios.put(`/update-combo/${id}`, formDataAppend, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.log(error);
  }
};
