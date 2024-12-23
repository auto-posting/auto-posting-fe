import { useContext } from 'react';
import { SelectContext } from './selectContext';

export default function useSelect() {
  const context = useContext(SelectContext);
  if (!context) throw new Error('Select에서 사용해주세요!');
  return context;
}
