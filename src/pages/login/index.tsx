import Button from '@/shared/ui/Button';
import googleLogo from '@/assets/svgs/google-logo.svg';
import { API_BASE_URL } from '@/shared/config/constants/baseUrl';

export default function Login() {
  const isLocal = window.location.origin.includes('127') ? true : false;

  return (
    <main className="w-full h-full flex flex-col justify-center items-center">
      <h1 className="text-main">AUTOPO</h1>
      <p className="font-bold pt-2">자동 포스팅 수익화를 현실로</p>
      <Button
        className="w-72 mt-20 px-4 flex items-center gap-10 h-12 bg-transparent border border-gray-300"
        href={`${API_BASE_URL}/api/auth/google/login${isLocal ? '/local' : ''}`}>
        <img src={googleLogo} alt="Google Logo" className="rounded-full" />
        <p className="pr-8">Google로 계속하기</p>
      </Button>
    </main>
  );
}
