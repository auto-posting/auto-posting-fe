import { ButtonHTMLAttributes, PropsWithChildren } from 'react';

import { Link } from 'react-router-dom';

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  href?: string;
}
export default function Button({ className, children, href, ...rest }: PropsWithChildren<IButtonProps>) {
  if (href) {
    return (
      <Link to={href} className={`${className} w-full py-2 rounded text-center`}>
        {children}
      </Link>
    );
  }
  return (
    <button className={`${className} w-full py-2 rounded`} {...rest}>
      {children}
    </button>
  );
}
