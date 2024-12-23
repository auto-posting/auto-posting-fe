import { axiosInstance } from '@/shared/api/axiosInstance';

type userInfoData = {
  tokens: {
    access: string;
    refresh: string;
  };
  user: {
    email: string;
  };
};

export async function userInfo() {
  const response = await axiosInstance.get<userInfoData>('/api/users/me');
  return { data: response.data };
}

export async function refreshToken<T>(body: T) {
  const response = await axiosInstance.post('/api/users/refresh', body);
  return { data: response.data };
}
