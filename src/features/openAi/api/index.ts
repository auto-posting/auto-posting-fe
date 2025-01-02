import { axiosInstance } from '@/shared/api/axiosInstance';

type GetOpenaiResponse = {
  message: string;
  data: Record<string, string | number>[];
};

type PostOpenaiResquest = {
  api_key?: string;
  nickname?: string;
};

type DeleteOpenaiResquest = {
  openai_id?: number;
};

export async function getOpenai() {
  const response = await axiosInstance.get<GetOpenaiResponse>('/api/openai');
  return { data: response.data };
}

export async function postOpenai(body: PostOpenaiResquest) {
  const response = await axiosInstance.post('/api/openai', body);
  return { data: response.data };
}

export async function deleteOpenai({ openai_id }: DeleteOpenaiResquest) {
  if (openai_id === undefined) {
    throw new Error('openai_id is undefined. Cannot proceed with deletion.');
  }

  const response = await axiosInstance.delete(`/api/openai/${openai_id}`);
  return { data: response.data };
}
