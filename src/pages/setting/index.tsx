import { getCoupangPartners } from '@/features/coupangPartners/api';
import { getOpenai } from '@/features/openAi/api';
import { deleteSetting, getGptTopics, getSettingList } from '@/features/setting/api';
import { getWordpress } from '@/features/wordPress/api';
import { ModalContext } from '@/shared/model/ModalContext';
import useFetch from '@/shared/model/useFetch';
import useModal from '@/shared/model/useModal';
import Button from '@/shared/ui/Button';
import { useCallback, useContext, useEffect } from 'react';

export default function Setting() {
  const { open } = useModal();
  const modalContext = useContext(ModalContext);

  if (!modalContext) {
    throw new Error('ModalContext must be used within a ModalProvider');
  }

  const { settingData } = modalContext;

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

  const { execute: deleteSettingExecute } = useFetch((params?: { setting_id: number }) => {
    if (!params) {
      console.error('Params are undefined');
      return Promise.reject(new Error('Params are undefined'));
    }
    return deleteSetting(params);
  });

  const handleDeleteSetting = async (settingId: number) => {
    if (settingId !== undefined) {
      try {
        await deleteSettingExecute({ setting_id: settingId });
        settingExecute();
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  useEffect(() => {
    fetchSettingList();
    fetchCoupangData();
    fetchOpenaiData();
    fetchWordpressData();
    fetchGptTopics();
  }, [fetchSettingList, fetchCoupangData, fetchOpenaiData, fetchWordpressData, fetchGptTopics]);

  useEffect(() => {
    settingExecute();
  }, [settingData]);

  return (
    <main className="flex flex-col p-10">
      <Button className="bg-sub text-white font-bold w-[30%]" onClick={() => open('setting')}>
        스케줄링 추가
      </Button>
      {settingList?.data.map(setting => (
        <ul key={setting.id} className="border-2 border-sub rounded-lg p-5 my-5 grid grid-cols-2 gap-5">
          <li>
            <span className="font-bold text-sub">포스팅 주제: </span>
            {gptTopics?.data.find(item => item.id === setting.gpt_topic_id)?.topic}
          </li>
          <li className="flex justify-center">
            <span className="font-bold text-sub">GPT Nickname: </span>
            {openaiData?.data.find(item => item.id === setting.gpt_id)?.nickname}
          </li>
          <li>
            <span className="font-bold text-sub">Wordpress Nickname: </span>{' '}
            {wordpressData?.data.find(item => item.id === setting.wordpress_id)?.nickname}
          </li>
          <li>
            <span className="font-bold text-sub">Coupang Nickname: </span>
            {coupangData?.data.find(item => item.id === setting.coupang_id)?.nickname}
          </li>
          <li className="align-middle inline-flex items-center justify-center">
            <span className="font-bold">자동 포스팅 스케줄링: </span> {setting.interval_days}일 {setting.interval_hours}
            시간 {setting.interval_minutes}마다
          </li>
          <li className="flex justify-center gap-5">
            <button className="font-bold py-1 w-[32%] bg-sub rounded-lg text-white">시작</button>
            <button className="font-bold py-1 w-[32%] bg-gray-400 rounded-lg text-white">중지</button>
            <button
              className="font-bold py-1 w-[32%] bg-red-400 rounded-lg text-white"
              onClick={() => handleDeleteSetting(setting.id)}>
              삭제
            </button>
          </li>
        </ul>
      ))}
    </main>
  );
}
