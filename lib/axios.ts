import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/v1/",
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  (config) => {
    console.log("[Axios Request]", {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error("[Axios Request Error]", error);
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    console.log("[Axios Response]", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    if (error.response) {
      console.error("[Axios Response Error]", {
        url: error.response.config?.baseURL,
        status: error.response.status,
        data: error.response.data,
      });
    } else {
      console.error("[Axios Network Error]", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
