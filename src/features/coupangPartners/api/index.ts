import { axiosInstance } from '@/shared/api/axiosInstance';
import { GetResponse } from '@/shared/model/type';

type PostCoupangRequest = {
  api_key?: string;
  api_secret?: string;
  nickname?: string;
};

type DeleteCoupangRequest = {
  coupangpartners_id?: number;
};

export async function getCoupangPartners() {
  const response = await axiosInstance.get<GetResponse>('/api/coupangpartners');
  return { data: response.data };
}

export async function postCoupangPartners(body: PostCoupangRequest) {
  const response = await axiosInstance.post('/api/coupangpartners', body);
  return { data: response.data };
}

export async function deleteCoupangPartners({ coupangpartners_id }: DeleteCoupangRequest) {
  if (coupangpartners_id === undefined) {
    throw new Error('coupangpartners_id is undefined. Cannot proceed with deletion.');
  }

  const response = await axiosInstance.delete(`/api/coupangpartners/${coupangpartners_id}`);
  return { data: response.data };
}
