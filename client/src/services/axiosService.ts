import axios from 'axios';
import { urlConfig } from 'config';

const axiosInstance = axios.create({
  baseURL: urlConfig.API_URL,
  /* other custom settings */
});

export default axiosInstance;
