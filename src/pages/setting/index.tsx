import { getCoupangPartners } from '@/features/coupangPartners/api';
import { getOpenai } from '@/features/openAi/api';
import { deleteSetting, getGptTopics, getSettingList, updateSetting } from '@/features/setting/api';
import { getWordpress } from '@/features/wordPress/api';
import { ModalContext } from '@/shared/model/ModalContext';
import useFetch from '@/shared/model/useFetch';
import useModal from '@/shared/model/useModal';
import Button from '@/shared/ui/Button';
import { useCallback, useContext, useEffect, useState } from 'react';
import { X } from 'lucide-react';

export default function Setting() {
  const { open } = useModal();
  const modalContext = useContext(ModalContext);

  if (!modalContext) {
    throw new Error('ModalContext must be used within a ModalProvider');
  }

  const { settingData } = modalContext;

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingValues, setEditingValues] = useState<{
    wordpress_id: string | number;
    coupang_id: string | number;
    gpt_id: string | number;
    gpt_topic_id: string | number;
    interval_days: number;
    interval_hours: number;
    interval_minutes: number;
  }>({
    wordpress_id: '',
    coupang_id: '',
    gpt_id: '',
    gpt_topic_id: '',
    interval_days: 0,
    interval_hours: 0,
    interval_minutes: 0,
  });

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

  const handleEditClick = (setting: {
    id: number;
    wordpress_id: number;
    coupang_id: number;
    gpt_id: number;
    gpt_topic_id: number;
    interval_days: number;
    interval_hours: number;
    interval_minutes: number;
  }) => {
    setEditingId(setting.id);
    setEditingValues({
      wordpress_id: wordpressData?.data.find(item => item.id === setting.wordpress_id)?.nickname || '',
      coupang_id: coupangData?.data.find(item => item.id === setting.coupang_id)?.nickname || '',
      gpt_id: openaiData?.data.find(item => item.id === setting.gpt_id)?.nickname || '',
      gpt_topic_id: gptTopics?.data.find(item => item.id === setting.gpt_topic_id)?.topic || '',
      interval_days: setting.interval_days,
      interval_hours: setting.interval_hours,
      interval_minutes: setting.interval_minutes,
    });
  };

  const handleSaveClick = async (settingId: number) => {
    try {
      await updateSetting(
        { setting_id: settingId },
        {
          wordpress_id: Number(wordpressData?.data.find(item => item.nickname === editingValues.wordpress_id)?.id),
          coupang_id: Number(coupangData?.data.find(item => item.nickname === editingValues.coupang_id)?.id),
          gpt_id: Number(openaiData?.data.find(item => item.nickname === editingValues.gpt_id)?.id),
          gpt_topic_id: Number(gptTopics?.data.find(item => item.topic === editingValues.gpt_topic_id)?.id),
          interval_days: Number(editingValues.interval_days),
          interval_hours: Number(editingValues.interval_hours),
          interval_minutes: Number(editingValues.interval_minutes),
        }
      );
      setEditingId(null);
      settingExecute();
    } catch (error) {
      console.error('Update failed:', error);
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
      {settingList?.data.map(setting => {
        const isEditing = editingId === setting.id;
        return (
          <ul key={setting.id} className="relative border-2 border-sub rounded-lg p-5 my-5 grid grid-cols-2 gap-5">
            <X
              className="w-5 h-5 text-gray-400 cursor-pointer absolute top-2 right-2"
              onClick={() => handleDeleteSetting(setting.id)}
              aria-label="delete"
            />
            <li>
              <span className="font-bold text-sub">포스팅 주제: </span>
              {isEditing ? (
                <input
                  type="text"
                  className="border border-gray-300 rounded px-2 py-1 w-[60%]"
                  value={editingValues.gpt_topic_id}
                  onChange={e => setEditingValues({ ...editingValues, gpt_topic_id: e.target.value })}
                />
              ) : (
                gptTopics?.data.find(item => item.id === setting.gpt_topic_id)?.topic
              )}
            </li>
            <li className="flex justify-center">
              <span className="font-bold text-sub">GPT Nickname: </span>
              {isEditing ? (
                <input
                  type="text"
                  className="border border-gray-300 rounded px-2 py-1 ml-2 w-[50%]"
                  value={editingValues.gpt_id}
                  onChange={e => setEditingValues({ ...editingValues, gpt_id: e.target.value })}
                />
              ) : (
                openaiData?.data.find(item => item.id === setting.gpt_id)?.nickname
              )}
            </li>
            <li>
              <span className="font-bold text-sub">Wordpress Nickname: </span>{' '}
              {isEditing ? (
                <input
                  type="text"
                  className="border border-gray-300 rounded px-2 py-1 w-[50%]"
                  value={editingValues.wordpress_id}
                  onChange={e => setEditingValues({ ...editingValues, wordpress_id: e.target.value })}
                />
              ) : (
                wordpressData?.data.find(item => item.id === setting.wordpress_id)?.nickname
              )}
            </li>
            <li>
              <span className="font-bold text-sub">Coupang Nickname: </span>
              {isEditing ? (
                <input
                  type="text"
                  className="border border-gray-300 rounded px-2 py-1 w-[50%]"
                  value={editingValues.coupang_id}
                  onChange={e => setEditingValues({ ...editingValues, coupang_id: e.target.value })}
                />
              ) : (
                coupangData?.data.find(item => item.id === setting.coupang_id)?.nickname
              )}
            </li>
            <li className="align-middle inline-flex items-center justify-center">
              <span className="font-bold">자동 포스팅 스케줄링: </span>
              {isEditing ? (
                <>
                  <input
                    type="number"
                    className="border border-gray-300 rounded px-2 py-1 w-16 mx-1"
                    value={editingValues.interval_days}
                    onChange={e => setEditingValues({ ...editingValues, interval_days: Number(e.target.value) })}
                  />
                  일
                  <input
                    type="number"
                    className="border border-gray-300 rounded px-2 py-1 w-16 mx-1"
                    value={editingValues.interval_hours}
                    onChange={e => setEditingValues({ ...editingValues, interval_hours: Number(e.target.value) })}
                  />
                  시간
                  <input
                    type="number"
                    className="border border-gray-300 rounded px-2 py-1 w-16 mx-1"
                    value={editingValues.interval_minutes}
                    onChange={e => setEditingValues({ ...editingValues, interval_minutes: Number(e.target.value) })}
                  />
                  분마다
                </>
              ) : (
                <>
                  {' '}
                  {setting.interval_days}일 {setting.interval_hours}시간 {setting.interval_minutes}분마다
                </>
              )}
            </li>
            <li className="flex justify-center gap-5">
              <button className="font-bold py-1 w-[25%] bg-sub rounded-lg text-white">시작</button>
              <button className="font-bold py-1 w-[25%] bg-red-500 rounded-lg text-white">중지</button>
              <button
                className="font-bold py-1 w-[25%] bg-gray-500 rounded-lg text-white"
                onClick={() => (isEditing ? handleSaveClick(setting.id) : handleEditClick(setting))}>
                {isEditing ? '저장' : '수정'}
              </button>
            </li>
          </ul>
        );
      })}
    </main>
  );
}
