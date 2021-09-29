import axios from "axios";
import config from "../backendConfig";

const baseURL = `${config.address}/api`;

const axiosInstance = axios.create({
  baseURL,
  headers: { "X-Requested-With": "XMLHttpRequest" },
});

axiosInstance.interceptors.request.use((request) => {
  if (request.url.includes("/login") && request.data) {
    return request;
  }
  if (!request.url.includes("/userinfo")) {
    request.headers["Authorization"] = `Bearer ${localStorage.getItem(
      "accesstoken"
    )}`;
  }
  return request;
});

export default axiosInstance;
