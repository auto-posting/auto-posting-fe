import { axiosInstance } from '@/shared/api/axiosInstance';

export async function logout() {
  const response = await axiosInstance.get('/api/auth/logout');
  return response.data;
}
