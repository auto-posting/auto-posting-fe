import { InputHTMLAttributes } from 'react';

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label?: string;
  error?: string;
}

export default function Input({ className, label, error, ...rest }: IInputProps) {
  return (
    <label className="flex flex-col gap-1 w-full h-20">
      <p className="text-left">{label}</p>
      <input className={`${className} border border-gray w-full p-2 rounded`} {...rest} />
      {error && <p className="text-red text-sm">{error}</p>}
    </label>
  );
}
