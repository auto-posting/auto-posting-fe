import { createContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Children from './children';
import Modal from '../ui/Modal';
import useModalOpen from './useModalOpen';
import Input from '../ui/Input';
import { getCoupangPartners, postCoupangPartners } from '@/features/coupangPartners/api';
import useFetch from './useFetch';
import { getOpenai, postOpenai } from '@/features/openAi/api';
import { postWordpress } from '@/features/wordPress/api';
import { DATE, HOUR, MINUTE } from '../config/constants/time';
import Select from '@/shared/ui/Select/settingSelect';

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
    setting: {
      wordpress_id: 0,
      coupang_id: 0,
      gpt_id: 0,
      gpt_topic_id: 0,
      interval_days: 0,
      interval_hours: 0,
      interval_minutes: 0,
    },
  });
  const { data: coupangData, execute: coupangExecute } = useFetch(() => getCoupangPartners());
  const { execute: postCoupangExecute } = useFetch(() =>
    postCoupangPartners({
      api_key: formData.coupang.api_key,
      api_secret: formData.coupang.api_secret,
      nickname: formData.coupang.nickname,
    })
  );

  const { data: openaiData, execute: openaiExecute } = useFetch(() => getOpenai());
  const { execute: postOpenaiExecute } = useFetch(() =>
    postOpenai({
      api_key: formData.openai.api_key,
      nickname: formData.openai.nickname,
    })
  );

  const { data: wordpressData, execute: wordpressExecute } = useFetch(() => getOpenai());
  const { execute: postWordpressExecute } = useFetch(() =>
    postWordpress({
      name: formData.wordpress.name,
      password: formData.wordpress.password,
      url: formData.wordpress.url,
      nickname: formData.wordpress.nickname,
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
      setting: {
        ...prevState.setting,
        [name]: value,
      },
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

      close();
      alert('처리가 완료되었습니다.');
    } catch (error) {
      console.error('Submit failed:', error);
      alert('처리 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    if (coupangData) {
      console.log('Fetched data:', coupangData);
    }
    if (openaiData) {
      console.log('Fetched data:', openaiData);
    }
    if (wordpressData) {
      console.log('Fetched data:', wordpressData);
    }
  }, [coupangData, openaiData, wordpressData]);

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
                  <Select title="닉네임을 선택해주세요" items={['2020', '2222', '1111', '2223', '3024']} />
                </div>
                <div className="flex flex-col gap-1 pb-2">
                  <div className="flex justify-between">
                    <h2>쿠팡파트너스</h2>
                  </div>
                  <Select title="닉네임을 선택해주세요" items={['2020', '2222', '1111', '2223', '3024']} />
                </div>
                <div className="flex flex-col gap-1 pb-2">
                  <div className="flex justify-between">
                    <h2>GPT</h2>
                  </div>
                  <Select title="닉네임을 선택해주세요" items={['2020', '2222', '1111', '2223', '3024']} />
                </div>
              </div>
              <div className="w-[48%]">
                <div className="flex flex-col gap-1 pb-2">
                  <div className="flex justify-between">
                    <h2>포스팅 주제 설정</h2>
                  </div>
                  <Select title="포스팅 주제를 선택해주세요" items={['2020', '2222', '1111', '2223', '3024']} />
                </div>
                <div className="flex flex-col gap-1 pb-2">
                  <div className="flex flex-col">
                    <h2>예약 발행 스케줄 설정</h2>
                    <ol className="flex">
                      <li className="flex gap-1 items-center pr-1 whitespace-nowrap">
                        <Select title="0" items={DATE} />
                        일마다
                      </li>
                      <li className="flex gap-1 items-center pr-1 whitespace-nowrap">
                        <Select title="0" items={HOUR} />
                        시간마다
                      </li>
                      <li className="flex gap-1 items-center pr-1 whitespace-nowrap">
                        <Select title="0" items={MINUTE} />
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
