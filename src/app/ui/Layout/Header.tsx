import { useState } from 'react';
import menuBar from '@/assets/svgs/bars.svg';
import SideMenu from '../SideMenu';
import useSideMenu from '@/shared/model/useSideMenu';
import { Link } from 'react-router-dom';
import useAuth from '@/features/auth/model/useAuth';

export default function Header() {
  const { triggerRef, handleSideMenuOpen, isSideMenuOpen } = useSideMenu();
  const { handleLogout } = useAuth();
  const [activeLink, setActiveLink] = useState<string | null>('/my');

  const handleLinkClick = (link: string) => {
    setActiveLink(link);
  };

  return (
    <header className="w-full sticky top-0 flex items-center justify-between border-b border-sub px-1 py-2">
      <h2 className="text-main">AUTOPO</h2>
      <nav className="flex items-center gap-5">
        <Link
          to="/my"
          className={`${activeLink === '/my' ? 'sm:text-main ' : ''}nav-link`}
          onClick={() => handleLinkClick('/my')}>
          내 정보
        </Link>
        <Link
          to="/setting"
          className={`${activeLink === '/setting' ? 'sm:text-main ' : ''}nav-link`}
          onClick={() => handleLinkClick('/setting')}>
          포스팅 설정
        </Link>
        <Link
          to="/login"
          className="nav-link"
          onClick={() => {
            handleLinkClick('/login');
            handleLogout();
          }}>
          로그아웃
        </Link>
        <button className="sm:hidden" onClick={handleSideMenuOpen} ref={triggerRef}>
          <img src={menuBar} alt="menu" className="w-8 h-8" />
        </button>
        {isSideMenuOpen && <SideMenu />}
      </nav>
    </header>
  );
}
