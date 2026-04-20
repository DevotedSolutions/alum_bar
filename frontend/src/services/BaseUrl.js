import axios from "axios";

const instance = axios.create({
  //baseURL: "http://localhost:1000/api/",
  // baseURL:"http://51.20.193.213:3000/api",
  baseURL: "https://app.noutfermeture.com/api",
});

// Add a request interceptor to include token in headers
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("tokenDesby");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default instance;
