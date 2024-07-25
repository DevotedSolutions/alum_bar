import axios from '../BaseUrl';

export const deleteDesignation = async ({id}) =>{


    try {
        const response = await axios.delete(`/delete-designation/${id}`)

      
        return response
        
    } catch (error) {
        console.log(error)
    }

}