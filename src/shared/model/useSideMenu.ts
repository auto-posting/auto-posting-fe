import { useEffect, useRef, useState } from 'react';

export default function useSideMenu() {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const menuRef = useRef<HTMLUListElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  function handleClickOutside(event: MouseEvent) {
    if (!isSideMenuOpen) return;

    const isInsideMenu = menuRef.current?.contains(event.target as Node);
    const isInsideTrigger = triggerRef.current?.contains(event.target as Node);

    if (!isInsideMenu && !isInsideTrigger) {
      setIsSideMenuOpen(false);
    }
  }

  useEffect(() => {
    if (isSideMenuOpen) {
      window.addEventListener('click', handleClickOutside);
      return () => window.removeEventListener('click', handleClickOutside);
    }
  }, [isSideMenuOpen]);

  function handleSideMenuOpen() {
    setIsSideMenuOpen(prev => !prev);
  }

  return { menuRef, triggerRef, isSideMenuOpen, setIsSideMenuOpen, handleClickOutside, handleSideMenuOpen };
}
