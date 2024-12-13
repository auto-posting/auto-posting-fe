import { API_BASE_URL } from '@/shared/config/constants';
import axios from 'axios';

const baseURL = API_BASE_URL;

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});
