import { useEffect } from 'react';

export type ToastProps = {
  message: string;
};

export default function Toast({ message }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {}, 3000);
    return () => {
      clearTimeout(timer);
    };
  }, []);
  return (
    <div className={`fixed top w-[40%]`}>
      <p>{message}</p>
    </div>
  );
}
