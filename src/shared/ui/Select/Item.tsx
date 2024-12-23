import Children from '@/shared/model/children';

export default function Item({ children }: Children) {
  return <li className="w-full bg-white p-2">{children}</li>;
}
