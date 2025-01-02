import { createContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Children from './children';
import Modal from '../ui/Modal';
import useModalOpen from './useModalOpen';
import Input from '../ui/Input';
import { getCoupangPartners, postCoupangPartners } from '@/features/coupangPartners/api';
import useFetch from './useFetch';
import { getOpenai, postOpenai } from '@/features/openAi/api';

export type ModalType = 'wordpress' | 'coupang' | 'openai';

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
      wp_id: '',
      wp_password: '',
      wp_url: '',
      wp_nickname: '',
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
  }, [coupangData, openaiData]);

  return (
    <ModalContext.Provider value={{ isOpen, open, close }}>
      {children}
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
    </ModalContext.Provider>
  );
}
