import { useState, useCallback } from 'react';
import { ModalType } from './ModalContext';

export default function useModalOpen() {
  const [openModal, setOpenModal] = useState<ModalType | null>(null);

  const open = useCallback((modalType: ModalType) => {
    setOpenModal(modalType);
  }, []);

  const close = useCallback(() => {
    setOpenModal(null);
  }, []);

  const isOpen = useCallback((modalType: ModalType) => openModal === modalType, [openModal]);

  return { isOpen, open, close, openModal };
}
