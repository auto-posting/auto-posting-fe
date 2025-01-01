import { axiosInstance } from '@/shared/api/axiosInstance';

type GetCoupangResponse = {
  message: string;
  data: Record<string, string | number>[];
};

type PostCoupangResquest = {
  api_key?: string;
  api_secret?: string;
  nickname?: string;
};

type DeleteCoupangResquest = {
  coupangpartners_id?: number;
};

export async function getCoupangPartners() {
  const response = await axiosInstance.get<GetCoupangResponse>('/api/coupangpartners');
  return { data: response.data };
}

export async function postCoupangPartners(body: PostCoupangResquest) {
  const response = await axiosInstance.post('/api/coupangpartners', body);
  return { data: response.data };
}

export async function deleteCoupangPartners({ coupangpartners_id }: DeleteCoupangResquest) {
  if (coupangpartners_id === undefined) {
    throw new Error('coupangpartners_id is undefined. Cannot proceed with deletion.');
  }

  const response = await axiosInstance.delete(`/api/coupangpartners/${coupangpartners_id}`);
  return { data: response.data };
}
