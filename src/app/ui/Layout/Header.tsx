import menuBar from '@/assets/svgs/bars.svg';

export default function Header() {
  return (
    <header className="w-full sticky top-0 flex items-center justify-between border-b border-sub px-1 py-2">
      <h2 className="text-main">AUTOPO</h2>
      <img src={menuBar} alt="menu" className="w-8 h-8" />
    </header>
  );
}
