import Children from '@/shared/model/children';
import triggerArrow from '@/assets/svgs/arrow-down.svg';
import useSelect from '@/shared/model/useSelect';

export default function Trigger({ children }: Children) {
  const { isToggle, toggle } = useSelect();

  return (
    <button
      onClick={toggle}
      className="text-left w-full border border-gray p-2 rounded flex justify-between items-center">
      {children} <img src={triggerArrow} className={`${isToggle ? 'rotate-180' : ''}`} />
    </button>
  );
}
