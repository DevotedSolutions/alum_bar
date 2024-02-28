import axios from "axios";


const instance = axios.create({
 //baseURL: "http://localhost:1000/api/",
  //baseURL:"http://51.20.193.213:3000/api"
 baseURL:"https://inventory.api.noutfermeture.com/api"
});


export default instance;