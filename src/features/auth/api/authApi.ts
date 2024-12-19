import { axiosInstance } from '@/shared/api/axiosInstance';

interface Code {
  code: string | false | null;
}

interface GoogleCallbackData {
  success: boolean;
  tokens: {
    access: string;
    refresh: string;
  };
  user: {
    email: string;
  };
}

export async function getGoogleAuth({ code }: Code): Promise<{ data: GoogleCallbackData } | undefined> {
  const response = await axiosInstance.get<GoogleCallbackData>(`/api/auth/google/callback/local?code=${code}`);
  return { data: response.data };
}

export async function logout() {
  try {
    const response = await axiosInstance.get('/api/auth/logout');
    return response.data;
  } catch (error) {
    console.error('Logout failed:', error);
  }
}
