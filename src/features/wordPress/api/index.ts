import { axiosInstance } from '@/shared/api/axiosInstance';

type GetWordpressResponse = {
  message: string;
  data: Record<string, string | number>[];
};

type PostWordpressResquest = {
  name: string;
  password: string;
  url: string;
  nickname: string;
};

type DeleteWordpressResquest = {
  wordpress_id?: number;
};

export async function getWordpress() {
  const response = await axiosInstance.get<GetWordpressResponse>('/api/wordpress');
  return { data: response.data };
}

export async function postWordpress(body: PostWordpressResquest) {
  const response = await axiosInstance.post('/api/wordpress', body);
  return { data: response.data };
}

export async function deleteWordpress({ wordpress_id }: DeleteWordpressResquest) {
  if (wordpress_id === undefined) {
    throw new Error('wordpress_id is undefined. Cannot proceed with deletion.');
  }

  const response = await axiosInstance.delete(`/api/wordpress/${wordpress_id}`);
  return { data: response.data };
}
