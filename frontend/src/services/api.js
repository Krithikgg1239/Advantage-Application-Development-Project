import axios from "axios";

// NOTE: We deliberately mutate the global axios object instead of calling
// axios.create(). This is required so that jest.mock('axios') in tests can
// intercept every request made through this module — axios.create() returns
// a new instance that Jest's automatic mock does not attach to.

axios.defaults.baseURL = "http://localhost:8080/api";

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("advantage_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API request failed:", error);
    return Promise.reject(error);
  }
);

export default axios;