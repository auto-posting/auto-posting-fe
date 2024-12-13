import menuBar from '@/assets/svgs/bars.svg';
import SideMenu from '../SideMenu';
import useSideMenu from '@/shared/model/useSideMenu';

export default function Header() {
  const { triggerRef, handleSideMenuOpen, isSideMenuOpen } = useSideMenu();

  return (
    <header className="w-full sticky top-0 flex items-center justify-between border-b border-sub px-1 py-2">
      <h2 className="text-main">AUTOPO</h2>
      <nav>
        <button onClick={handleSideMenuOpen} ref={triggerRef}>
          <img src={menuBar} alt="menu" className="w-8 h-8" />
        </button>
        {isSideMenuOpen && <SideMenu />}
      </nav>
    </header>
  );
}
