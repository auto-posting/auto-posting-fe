import { PropsWithChildren } from 'react';

export interface Modal {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export default function Root({ isOpen, onClose, children, onSubmit }: PropsWithChildren<Modal>) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[30%] shadow-lg">
        {children}
        <div className="flex justify-between">
          <button className="py-2 w-[45%] bg-sub rounded-lg text-white" onClick={onSubmit}>
            추가
          </button>
          <button className="py-2 w-[45%] bg-gray-400 rounded-lg text-white" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
