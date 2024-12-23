import { getAccessToken, getRefreshToken } from '@/shared/lib/cookie';
import { API_BASE_URL } from '@/shared/config/constants';
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { authAxiosInstance } from './authAxiosInstance';
import { refreshToken } from '@/features/myInfo/api/userApi';

const baseURL = API_BASE_URL;

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const onRequest = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const ACCESS_TOKEN = getAccessToken();
  if (ACCESS_TOKEN) {
    config.headers.Authorization = `Bearer ${ACCESS_TOKEN}`;
  }
  return config;
};

const onFulfilled = (res: AxiosResponse): AxiosResponse => {
  return res;
};

const onRejected = async (error: AxiosError | Error) => {
  if (axios.isAxiosError(error) && error.config) {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const REFRESH_TOKEN = getRefreshToken();

    if (error.response) {
      const { status } = error.response;

      if (status === 401 && originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const response = await refreshToken({ REFRESH_TOKEN });
          const newAccessToken = response.data.access_token;

          if (document) {
            document.cookie = `access_token=${newAccessToken}; path=/`;
          }

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return authAxiosInstance(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
    }
  } else {
    console.log(`error: ${error.message}`);
  }

  return Promise.reject(error);
};

axiosInstance.interceptors.request.use(onRequest);
axiosInstance.interceptors.response.use(onFulfilled, onRejected);

export default axiosInstance;
