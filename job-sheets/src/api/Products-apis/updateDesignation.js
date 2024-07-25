import axios from '../BaseUrl';

export const updateDesignation = async ({formDataAppend,id}) =>{

console.log(formDataAppend,id)
    try {
        const response = await axios.put(`/update-designation/${id}`,formDataAppend,
        {headers: {
            "Content-Type": "multipart/form-data",
          }})

        console.log(response)
        return response
        
    } catch (error) {
        console.log(error)
    }

}