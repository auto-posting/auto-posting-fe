import { useState } from 'react';

export default function useModalOpen(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  return { isOpen, open, close };
}
