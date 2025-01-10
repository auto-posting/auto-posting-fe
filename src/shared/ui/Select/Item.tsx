import Children from '@/shared/model/children';

interface Item extends Children {
  onClick: () => void;
}

export default function Item({ children, onClick }: Item) {
  return (
    <li className="w-full bg-white p-2 cursor-pointer" onClick={onClick}>
      {children}
    </li>
  );
}
