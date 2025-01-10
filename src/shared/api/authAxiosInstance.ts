import { API_BASE_URL } from '@/shared/config/constants/baseUrl';
import axios from 'axios';

const baseURL = API_BASE_URL;

export const authAxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});
