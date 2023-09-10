import axios from 'axios';

axios.defaults.withCredentials = true;

const apiClient = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api`,
  withCredentials: true,
});

export default apiClient;
