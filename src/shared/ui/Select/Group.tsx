import Children from '@/shared/model/children';
import useSelect from '@/shared/model/useSelect';

export default function Group({ children }: Children) {
  const { isToggle } = useSelect();
  if (!isToggle) return null;
  return (
    <ul className={`z-10 absolute left-0 top-full w-full max-h-20 bg-white overflow-scroll shadow-md`}>{children}</ul>
  );
}
