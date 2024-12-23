import Children from '@/shared/model/children';

export default function Root({ children }: Children) {
  return <div className="relative w-full flex flex-col gap-1">{children}</div>;
}
