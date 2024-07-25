import axios from '../BaseUrl';

export const addDesignation = async ({formDataAppend}) =>{


    try {
        const response = await axios.post(`/add-designation`,formDataAppend,
        {headers: {
            "Content-Type": "multipart/form-data",
          }})

      
        return response
        
    } catch (error) {
        console.log(error)
    }

}