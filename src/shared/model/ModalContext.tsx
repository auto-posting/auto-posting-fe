import { createContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Children from './children';
import Modal from '../ui/Modal';
import useModalOpen from './useModalOpen';
import Input from '../ui/Input';
import { getCoupangPartners, postCoupangPartners } from '@/features/coupangPartners/api';
import useFetch from './useFetch';

export interface ModalContext {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const ModalContext = createContext<ModalContext | undefined>(undefined);

export function ModalProvider({ children }: Children) {
  const { isOpen, open, close } = useModalOpen();
  const [formData, setFormData] = useState({
    api_key: '',
    api_secret: '',
    nickname: '',
  });
  const { data: coupangData, execute: coupangExecute } = useFetch(() => getCoupangPartners());
  const { execute: postCoupangExecute } = useFetch(() =>
    postCoupangPartners({
      api_key: formData.api_key,
      api_secret: formData.api_secret,
      nickname: formData.nickname,
    })
  );
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!formData.api_key.trim() || !formData.api_secret.trim()) {
        alert('값을 입력하세요.');
        return;
      }
      await postCoupangExecute();
      await coupangExecute();
      close();
    } catch (error) {
      console.error('Submit failed:', error);
    }
  };

  useEffect(() => {
    if (coupangData) {
      console.log('Fetched data:', coupangData);
    }
  }, [coupangData]);

  return (
    <ModalContext.Provider value={{ isOpen, open, close }}>
      {children}
      {createPortal(
        <Modal isOpen={isOpen} onClose={close} onSubmit={handleSubmit}>
          <Input
            label="쿠팡파트너스 Api Key"
            name="api_key"
            type="text"
            value={formData.api_key}
            onChange={handleInputChange}
            placeholder="추가할 값을 입력해주세요"
          />
          <Input
            label="쿠팡파트너스 Api Secret"
            name="api_secret"
            type="text"
            value={formData.api_secret}
            onChange={handleInputChange}
            placeholder="추가할 값을 입력해주세요"
          />
          <Input
            label="쿠팡파트너스 Nickname"
            name="nickname"
            type="text"
            value={formData.nickname}
            onChange={handleInputChange}
            placeholder="추가할 값을 입력해주세요"
          />
        </Modal>,
        document.body
      )}
    </ModalContext.Provider>
  );
}
