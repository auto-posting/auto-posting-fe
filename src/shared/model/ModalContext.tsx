import { createContext, useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Children from './children';
import Modal from '../ui/Modal';
import useModalOpen from './useModalOpen';
import Input from '../ui/Input';
import { getCoupangPartners, postCoupangPartners } from '@/features/coupangPartners/api';
import useFetch from './useFetch';
import { getOpenai, postOpenai } from '@/features/openAi/api';
import { getWordpress, postWordpress } from '@/features/wordPress/api';
import { DATE, HOUR, MINUTE } from '../config/constants/time';
import Select from '@/shared/ui/Select/settingSelect';
import { createSetting, getGptTopics, getSettingList } from '@/features/setting/api';

export type ModalType = 'wordpress' | 'coupang' | 'openai' | 'setting';

export interface ModalContext {
  isOpen: (modalType: ModalType) => boolean;
  open: (modaltype: ModalType) => void;
  close: (modaltype: ModalType) => void;
}

export const ModalContext = createContext<ModalContext | undefined>(undefined);

export function ModalProvider({ children }: Children) {
  const { isOpen, open, close, openModal } = useModalOpen();
  const [formData, setFormData] = useState({
    wordpress: {
      name: '',
      password: '',
      url: '',
      nickname: '',
    },
    coupang: {
      api_key: '',
      api_secret: '',
      nickname: '',
    },
    openai: {
      api_key: '',
      nickname: '',
    },
  });
  const [settingData, setSettingData] = useState({
    wordpress_id: 0,
    coupang_id: 0,
    gpt_id: 0,
    gpt_topic_id: 0,
    interval_days: 0,
    interval_hours: 0,
    interval_minutes: 0,
  });
  const { data: coupangData, loading: coupangLoading, execute: coupangExecute } = useFetch(() => getCoupangPartners());
  const { execute: postCoupangExecute } = useFetch(() =>
    postCoupangPartners({
      api_key: formData.coupang.api_key,
      api_secret: formData.coupang.api_secret,
      nickname: formData.coupang.nickname,
    })
  );

  const { data: openaiData, loading: openaiLoading, execute: openaiExecute } = useFetch(() => getOpenai());
  const { execute: postOpenaiExecute } = useFetch(() =>
    postOpenai({
      api_key: formData.openai.api_key,
      nickname: formData.openai.nickname,
    })
  );

  const { data: wordpressData, loading: wordpressLoading, execute: wordpressExecute } = useFetch(() => getWordpress());
  const { execute: postWordpressExecute } = useFetch(() =>
    postWordpress({
      name: formData.wordpress.name,
      password: formData.wordpress.password,
      url: formData.wordpress.url,
      nickname: formData.wordpress.nickname,
    })
  );
  const { data: gptTopics, loading: gptTopicsLoading, execute: gptTopicsExecute } = useFetch(() => getGptTopics());

  const { execute: settingListExecute } = useFetch(() => getSettingList());
  const { execute: postSetting } = useFetch(() =>
    createSetting({
      wordpress_id: Number(wordpressData?.data.find(item => item.nickname === settingData.wordpress_id)?.id),
      coupang_id: Number(coupangData?.data.find(item => item.nickname === settingData.coupang_id)?.id),
      gpt_id: Number(openaiData?.data.find(item => item.nickname === settingData.gpt_id)?.id),
      gpt_topic_id: Number(gptTopics?.data.find(item => item.topic === settingData.gpt_topic_id)?.id),
      interval_days: Number(settingData.interval_days),
      interval_hours: Number(settingData.interval_hours),
      interval_minutes: Number(settingData.interval_minutes),
    })
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      coupang: {
        ...prevState.coupang,
        [name]: value,
      },
      openai: {
        ...prevState.coupang,
        [name]: value,
      },
      wordpress: {
        ...prevState.wordpress,
        [name]: value,
      },
    }));
  };

  const handleSelectChange = (e: { target: { name: string; value: string | number } }) => {
    const { name, value } = e.target;

    setSettingData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const currentModal = openModal;

      if (!currentModal) {
        alert('올바른 모달 타입이 없습니다.');
        return;
      }

      if (currentModal === 'coupang') {
        if (!formData.coupang.api_key.trim() || !formData.coupang.api_secret.trim()) {
          alert('값을 입력하세요.');
          return;
        }
        await postCoupangExecute();
        await coupangExecute();
      }
      if (currentModal === 'openai') {
        if (!formData.openai.api_key.trim()) {
          alert('값을 입력하세요.');
          return;
        }
        await postOpenaiExecute();
        await openaiExecute();
      }
      if (currentModal === 'wordpress') {
        if (!formData.wordpress.name.trim() || !formData.wordpress.password || !formData.wordpress.url) {
          alert('값을 입력하세요.');
          return;
        }
        await postWordpressExecute();
        await wordpressExecute();
      }
      if (currentModal === 'setting') {
        if (
          !String(settingData.coupang_id).trim() ||
          !String(settingData.gpt_id).trim() ||
          !String(settingData.gpt_topic_id).trim() ||
          !String(settingData.wordpress_id).trim() ||
          !String(settingData.wordpress_id).trim()
        ) {
          alert('값을 입력하세요.');
          return;
        }
        await postSetting();
        await settingListExecute();
      }

      close();
      alert('처리가 완료되었습니다.');
    } catch (error) {
      console.error('Submit failed:', error);
      alert('처리 중 오류가 발생했습니다.');
    }
  };

  const fetchCoupangData = useCallback(() => {
    if (!coupangLoading && !coupangData) {
      coupangExecute();
    }
  }, [coupangData, coupangLoading, coupangExecute]);

  const fetchOpenaiData = useCallback(() => {
    if (!openaiLoading && !openaiData) {
      openaiExecute();
    }
  }, [openaiData, openaiLoading, openaiExecute]);

  const fetchWordpressData = useCallback(() => {
    if (!wordpressLoading && !wordpressData) {
      wordpressExecute();
    }
  }, [wordpressData, wordpressLoading, wordpressExecute]);

  const fetchGptTopics = useCallback(() => {
    if (!gptTopicsLoading && !gptTopics) {
      gptTopicsExecute();
    }
  }, [gptTopics, gptTopicsLoading, gptTopicsExecute]);

  useEffect(() => {
    fetchOpenaiData();
    fetchCoupangData();
    fetchWordpressData();
    fetchGptTopics();
  }, [fetchOpenaiData, fetchCoupangData, fetchWordpressData, fetchGptTopics]);

  return (
    <ModalContext.Provider value={{ isOpen, open, close }}>
      {children}
      {isOpen('setting') &&
        createPortal(
          <Modal className="w-[80%]" isOpen onClose={close} onSubmit={handleSubmit}>
            <div className="flex justify-between">
              <div className="w-[48%]">
                <div className="flex flex-col gap-1 pb-2">
                  <div className="flex justify-between">
                    <h2>워드프레스</h2>
                  </div>
                  <Select
                    name="wordpress_id"
                    title="닉네임을 선택해주세요"
                    items={wordpressData?.data.map(item => item.nickname) || ['사용 가능한 닉네임이 없습니다']}
                    value={settingData.wordpress_id}
                    onChange={handleSelectChange}
                  />
                </div>
                <div className="flex flex-col gap-1 pb-2">
                  <div className="flex justify-between">
                    <h2>쿠팡파트너스</h2>
                  </div>
                  <Select
                    name="coupang_id"
                    title="닉네임을 선택해주세요"
                    items={coupangData?.data.map(item => item.nickname) || ['사용 가능한 닉네임이 없습니다']}
                    value={settingData.coupang_id}
                    onChange={handleSelectChange}
                  />
                </div>
                <div className="flex flex-col gap-1 pb-2">
                  <div className="flex justify-between">
                    <h2>GPT</h2>
                  </div>
                  <Select
                    name="gpt_id"
                    title="닉네임을 선택해주세요"
                    items={openaiData?.data.map(item => item.nickname) || ['사용 가능한 닉네임이 없습니다']}
                    value={settingData.gpt_id}
                    onChange={handleSelectChange}
                  />
                </div>
              </div>
              <div className="w-[48%]">
                <div className="flex flex-col gap-1 pb-2">
                  <div className="flex justify-between">
                    <h2>포스팅 주제 설정</h2>
                  </div>
                  <Select
                    name="gpt_topic_id"
                    title="포스팅 주제를 선택해주세요"
                    items={gptTopics?.data.map(item => item.topic) || ['선택 가능한 포스팅 주제가 없습니다']}
                    value={settingData.gpt_topic_id}
                    onChange={handleSelectChange}
                  />
                </div>
                <div className="flex flex-col gap-1 pb-2">
                  <div className="flex flex-col">
                    <h2>예약 발행 스케줄 설정</h2>
                    <ol className="flex">
                      <li className="flex gap-1 items-center pr-1 whitespace-nowrap">
                        <Select
                          name="interval_days"
                          title="0"
                          items={DATE}
                          value={settingData.interval_days}
                          onChange={handleSelectChange}
                        />
                        일마다
                      </li>
                      <li className="flex gap-1 items-center pr-1 whitespace-nowrap">
                        <Select
                          name="interval_hours"
                          title="0"
                          items={HOUR}
                          value={settingData.interval_hours}
                          onChange={handleSelectChange}
                        />
                        시간마다
                      </li>
                      <li className="flex gap-1 items-center pr-1 whitespace-nowrap">
                        <Select
                          name="interval_minutes"
                          title="0"
                          items={MINUTE}
                          value={settingData.interval_minutes}
                          onChange={handleSelectChange}
                        />
                        분마다
                      </li>
                    </ol>
                  </div>{' '}
                </div>
              </div>
            </div>
          </Modal>,
          document.body
        )}
      {isOpen('coupang') &&
        createPortal(
          <Modal isOpen onClose={close} onSubmit={handleSubmit}>
            <Input
              label="쿠팡파트너스 Api Key"
              name="api_key"
              type="text"
              value={formData.coupang.api_key}
              onChange={handleInputChange}
              placeholder="추가할 값을 입력해주세요"
            />
            <Input
              label="쿠팡파트너스 Api Secret"
              name="api_secret"
              type="text"
              value={formData.coupang.api_secret}
              onChange={handleInputChange}
              placeholder="추가할 값을 입력해주세요"
            />
            <Input
              label="쿠팡파트너스 Nickname"
              name="nickname"
              type="text"
              value={formData.coupang.nickname}
              onChange={handleInputChange}
              placeholder="추가할 값을 입력해주세요"
            />
          </Modal>,
          document.body
        )}
      {isOpen('openai') &&
        createPortal(
          <Modal isOpen onClose={close} onSubmit={handleSubmit}>
            <Input
              label="GPT Api Key"
              name="api_key"
              type="text"
              value={formData.openai.api_key}
              onChange={handleInputChange}
              placeholder="추가할 값을 입력해주세요"
            />
            <Input
              label="GPT Nickname"
              name="nickname"
              type="text"
              value={formData.openai.nickname}
              onChange={handleInputChange}
              placeholder="추가할 값을 입력해주세요"
            />
          </Modal>,
          document.body
        )}
      {isOpen('wordpress') &&
        createPortal(
          <Modal isOpen onClose={close} onSubmit={handleSubmit}>
            <Input
              label="Wordpress URL"
              name="url"
              type="text"
              value={formData.wordpress.url}
              onChange={handleInputChange}
              placeholder="추가할 값을 입력해주세요"
            />
            <Input
              label="Wordpress Name"
              name="name"
              type="text"
              value={formData.wordpress.name}
              onChange={handleInputChange}
              placeholder="추가할 값을 입력해주세요"
            />
            <Input
              label="Wordpress PASSWORD"
              name="password"
              type="text"
              value={formData.wordpress.password}
              onChange={handleInputChange}
              placeholder="추가할 값을 입력해주세요"
            />
            <Input
              label="Wordpress Nickname"
              name="nickname"
              type="text"
              value={formData.wordpress.nickname}
              onChange={handleInputChange}
              placeholder="추가할 값을 입력해주세요"
            />
          </Modal>,
          document.body
        )}
    </ModalContext.Provider>
  );
}
