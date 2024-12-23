import Children from '@/shared/model/children';
import useSelect from '@/shared/model/useSelect';

export default function Group({ children }: Children) {
  const { isToggle } = useSelect();
  if (!isToggle) return null;
  return (
    <ul
      className={`z-10 absolute left-0 top-full w-full max-h-32 bg-white overflow-scroll shadow-md scrollbar scrollbar-thumb-gray-400 scrollbar-track-gray-200`}>
      {children}
    </ul>
  );
}
