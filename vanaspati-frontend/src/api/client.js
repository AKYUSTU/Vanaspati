import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  withCredentials: true,
});

client.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('vanaspati_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const apiMessage = error?.response?.data?.message;

    if (typeof apiMessage === 'string' && apiMessage.trim()) {
      error.userMessage = apiMessage;
    } else if (status === 401) {
      error.userMessage = 'Your session has expired. Please sign in again.';
    } else if (status === 403) {
      error.userMessage = 'You are not allowed to perform this action.';
    } else if (status === 404) {
      error.userMessage = 'The requested resource was not found.';
    } else if (status >= 500) {
      error.userMessage = 'Server error. Please try again in a moment.';
    } else {
      error.userMessage = error.message || 'Request failed.';
    }

    return Promise.reject(error);
  }
);

export default client;
