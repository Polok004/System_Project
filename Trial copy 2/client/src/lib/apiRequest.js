import axios from "axios";

const apiRequest = axios.create({
  baseURL: "http://localhost:8800/api",
  withCredentials: true,
});

apiRequest.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await apiRequest.get("/auth/refresh"); // Request a new token
        return apiRequest(error.config); // Retry the original request
      } catch (err) {
        window.location.href = "/login"; // Redirect to login if refresh fails
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default apiRequest;