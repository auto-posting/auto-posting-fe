import { axiosInstance } from '@/shared/api/axiosInstance';

type GetWordpressResponse = {
  message: string;
  data: Record<string, string | number>[];
};

type PostWordpressRequest = {
  name: string;
  password: string;
  url: string;
  nickname: string;
};

type DeleteWordpressRequest = {
  wordpress_id?: number;
};

export async function getWordpress() {
  const response = await axiosInstance.get<GetWordpressResponse>('/api/wordpress');
  return { data: response.data };
}

export async function postWordpress(body: PostWordpressRequest) {
  const response = await axiosInstance.post('/api/wordpress', body);
  return { data: response.data };
}

export async function deleteWordpress({ wordpress_id }: DeleteWordpressRequest) {
  if (wordpress_id === undefined) {
    throw new Error('wordpress_id is undefined. Cannot proceed with deletion.');
  }

  const response = await axiosInstance.delete(`/api/wordpress/${wordpress_id}`);
  return { data: response.data };
}
