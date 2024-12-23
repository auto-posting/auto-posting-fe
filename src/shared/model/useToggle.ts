import { useState, useCallback } from 'react';

export default function useToggle(initialState = false) {
  const [isToggle, setIsToggle] = useState(initialState);

  const toggle = useCallback(() => {
    setIsToggle(prev => !prev);
  }, []);

  return { isToggle, toggle };
}
