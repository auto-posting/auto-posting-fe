import { useContext } from 'react';
import { ModalContext } from './ModalContext';

export default function useModal() {
  const context = useContext(ModalContext);
  if (!context) throw new Error('Modal Provider 내부에서 사용해주세요!');
  return context;
}
