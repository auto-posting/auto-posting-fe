import Button from '@/shared/ui/Button';
import googleLogo from '@/assets/svgs/google-logo.svg';

export default function Login() {
  return (
    <main>
      <h1 className="text-main">AUTOPO</h1>
      <p className="font-bold pt-2">자동 포스팅 수익화를 현실로</p>
      <Button className="mt-20 flex items-center gap-6 h-12 bg-transparent border-gray-300">
        <img src={googleLogo} alt="Google Logo" className="rounded-full" />
        <p className="pr-8">Google로 계속하기</p>
      </Button>
    </main>
  );
}
