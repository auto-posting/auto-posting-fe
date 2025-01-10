import useModal from '@/shared/model/useModal';
import Button from '@/shared/ui/Button';

export default function Setting() {
  const { open } = useModal();

  return (
    <div className="grid grid-cols-3 place-items-center h-[20%]">
      <Button className="bg-sub text-white font-bold w-11/12" onClick={() => open('setting')}>
        스케줄링 추가
      </Button>
    </div>
  );
}
