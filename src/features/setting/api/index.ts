import axiosInstance from '@/shared/api/axiosInstance';
import { GetResponse } from '@/shared/model/type';

type SettingId = {
  setting_id: number;
};

type SettingRequest = {
  wordpress_id: number;
  coupang_id: number;
  gpt_id: number;
  gpt_topic_id: number;
  interval_days: number;
  interval_hours: number;
  interval_minutes: number;
};

export async function getSettingList() {
  const response = await axiosInstance.get<GetResponse>('/api/wordpress-setting/wordpress-setting');
  return { data: response.data };
}

export async function createSetting(body: SettingRequest) {
  const response = await axiosInstance.post('/api/wordpress-setting/wordpress-setting', body);
  return { data: response.data };
}

export async function getGptTopics() {
  const response = await axiosInstance.get<GetResponse>('/api/wordpress-setting/gpt-topics');
  return { data: response.data };
}

export async function getSetting({ setting_id }: SettingId) {
  const response = await axiosInstance.get<GetResponse>(`/api/wordpress-setting/wordpress-setting/${setting_id}`);
  return { data: response.data };
}

export async function updateSetting({ setting_id }: SettingId, body: SettingRequest) {
  const response = await axiosInstance.post(`/api/wordpress-setting/wordpress-setting/${setting_id}`, body);
  return { data: response.data };
}

export async function deleteWordpress({ setting_id }: SettingId) {
  if (setting_id === undefined) {
    throw new Error('setting_id is undefined. Cannot proceed with deletion.');
  }

  const response = await axiosInstance.delete(`/api/wordpress-setting/wordpress-setting/${setting_id}`);
  return { data: response.data };
}
