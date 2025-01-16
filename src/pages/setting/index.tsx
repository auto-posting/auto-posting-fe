import { getCoupangPartners } from '@/features/coupangPartners/api';
import { getOpenai } from '@/features/openAi/api';
import { getGptTopics, getSettingList } from '@/features/setting/api';
import { getWordpress } from '@/features/wordPress/api';
import useFetch from '@/shared/model/useFetch';
import useModal from '@/shared/model/useModal';
import Button from '@/shared/ui/Button';
import { useCallback, useEffect } from 'react';

export default function Setting() {
  const { open } = useModal();
  const { data: settingList, loading: settingLoading, execute: settingExecute } = useFetch(() => getSettingList());
  const fetchSettingList = useCallback(() => {
    if (!settingLoading && !settingList) {
      settingExecute();
    }
  }, [settingList, settingLoading, settingExecute]);

  const { data: coupangData, loading: coupangLoading, execute: coupangExecute } = useFetch(() => getCoupangPartners());
  const fetchCoupangData = useCallback(() => {
    if (!coupangLoading && !coupangData) {
      coupangExecute();
    }
  }, [coupangData, coupangLoading, coupangExecute]);

  const { data: openaiData, loading: openaiLoading, execute: openaiExecute } = useFetch(() => getOpenai());
  const fetchOpenaiData = useCallback(() => {
    if (!openaiLoading && !openaiData) {
      openaiExecute();
    }
  }, [openaiData, openaiLoading, openaiExecute]);

  const { data: wordpressData, loading: wordpressLoading, execute: wordpressExecute } = useFetch(() => getWordpress());
  const fetchWordpressData = useCallback(() => {
    if (!wordpressLoading && !wordpressData) {
      wordpressExecute();
    }
  }, [wordpressData, wordpressLoading, wordpressExecute]);

  const { data: gptTopics, loading: gptTopicsLoading, execute: gptTopicsExecute } = useFetch(() => getGptTopics());
  const fetchGptTopics = useCallback(() => {
    if (!gptTopicsLoading && !gptTopics) {
      gptTopicsExecute();
    }
  }, [gptTopics, gptTopicsLoading, gptTopicsExecute]);

  useEffect(() => {
    fetchSettingList();
    fetchCoupangData();
    fetchOpenaiData();
    fetchWordpressData();
    fetchGptTopics();
  }, [fetchSettingList, fetchCoupangData, fetchOpenaiData, fetchWordpressData, fetchGptTopics]);

  return (
    <main className="flex flex-col p-10">
      <Button className="bg-sub text-white font-bold w-[30%]" onClick={() => open('setting')}>
        스케줄링 추가
      </Button>
      {settingList?.data.map(setting => (
        <section key={setting.id} className="border-2 border-sub rounded-lg p-5 my-5 grid grid-cols-2 gap-5">
          <div>gpt_nickname: {openaiData?.data.find(item => item.id === setting.gpt_id)?.nickname}</div>
          <div>coupang_nickname: {coupangData?.data.find(item => item.id === setting.coupang_id)?.nickname}</div>
          <div>wordpress_nickname: {wordpressData?.data.find(item => item.id === setting.wordpress_id)?.nickname}</div>
          <div>gpt_topic: {gptTopics?.data.find(item => item.id === setting.gpt_topic_id)?.topic}</div>
          <div>
            스케줄링: {setting.interval_days}일 {setting.interval_hours}시간 {setting.interval_minutes}마다
          </div>
          <div className="flex justify-center gap-5">
            <button className="py-2 w-[40%] bg-sub rounded-lg text-white">시작</button>
            <button className="py-2 w-[40%] bg-gray-400 rounded-lg text-white">중지</button>
          </div>
        </section>
      ))}
    </main>
  );
}
