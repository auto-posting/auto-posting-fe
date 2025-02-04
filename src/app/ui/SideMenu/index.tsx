import useAuth from '@/features/auth/model/useAuth';
import useSideMenu from '@/shared/model/useSideMenu';
import { Link } from 'react-router-dom';

export default function SideMenu() {
  const { menuRef, handleSideMenuOpen } = useSideMenu();
  const { handleLogout } = useAuth();

  return (
    <ul
      ref={menuRef}
      className="absolute top-12 right-0 flex flex-col bg-white text-sub border border-sub px-4 py-2 gap-2">
      <li>
        <Link to="/my" onClick={handleSideMenuOpen}>
          내 정보
        </Link>
      </li>
      <li>
        <Link to="/setting" onClick={handleSideMenuOpen}>
          포스팅 설정
        </Link>
      </li>
      <li>
        <Link to="/login" onClick={handleLogout}>
          로그아웃
        </Link>
      </li>
    </ul>
  );
}
