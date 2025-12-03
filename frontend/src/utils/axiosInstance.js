import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, 
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);

    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response from:', response.config.url, 'Status:', response.status);

    return response;
  },
  (error) => {
    console.error('Response error:', error);

    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        console.error('Unauthorized access - redirecting to login');
      }

      // Handle server errors
      if (status >= 500) {
        console.error('Server error occurred');
      }

      // Handle network errors
      if (status === 0 || !status) {
        console.error('Network error - check your connection');
      }

      // Return the error with the response data
      return Promise.reject({
        status,
        message: data?.message || error.message,
        data: data,
      });
    }

    // Handle network errors (no response from server)
    if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNABORTED') {
      return Promise.reject({
        status: 0,
        message: 'Network error - please check your connection',
        data: null,
      });
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      return Promise.reject({
        status: 408,
        message: 'Request timeout - please try again',
        data: null,
      });
    }

    // Return other errors as-is
    return Promise.reject(error);
  }
);

export default axiosInstance;
