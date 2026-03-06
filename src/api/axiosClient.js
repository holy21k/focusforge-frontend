import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (!config.headers['Content-Type']) config.headers['Content-Type'] = 'application/json';
  return config;
}, (error) => Promise.reject(error));

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(new Error(error.response?.data?.detail || error.message))
);

export default axiosClient;