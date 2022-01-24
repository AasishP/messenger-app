import axios from "axios";
import config from "../backendConfig";

const baseURL = `${config.address}/api`;

const axiosInstance = axios.create({
  baseURL,
  headers: { "X-Requested-With": "XMLHttpRequest" },
});

axiosInstance.interceptors.request.use((request) => {
  if (request.url.includes("/login") && request.data) {
    //this is the case if the login is performed with username and password which is contained in the request.data
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
