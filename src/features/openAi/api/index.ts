import { axiosInstance } from '@/shared/api/axiosInstance';
import { GetResponse } from '@/shared/model/type';

type PostOpenaiRequest = {
  api_key?: string;
  nickname?: string;
};

type DeleteOpenaiRequest = {
  openai_id?: number;
};

export async function getOpenai() {
  const response = await axiosInstance.get<GetResponse>('/api/openai');
  return { data: response.data };
}

export async function postOpenai(body: PostOpenaiRequest) {
  const response = await axiosInstance.post('/api/openai', body);
  return { data: response.data };
}

export async function deleteOpenai({ openai_id }: DeleteOpenaiRequest) {
  if (openai_id === undefined) {
    throw new Error('openai_id is undefined. Cannot proceed with deletion.');
  }

  const response = await axiosInstance.delete(`/api/openai/${openai_id}`);
  return { data: response.data };
}
