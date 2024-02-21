import axios from '../BaseUrl';

export const updateDesignation = async ({formDataAppend,id}) =>{


    try {
        const response = await axios.put(`/update-designation/${id}`,formDataAppend,
        {headers: {
            "Content-Type": "multipart/form-data",
          }})

      
        return response
        
    } catch (error) {
        console.log(error)
    }

}