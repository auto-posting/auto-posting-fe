import user from '@/assets/svgs/user.svg';
import { userInfo } from '@/features/myInfo/api/userApi';
import useFetch from '@/shared/model/useFetch';
import Button from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';
import Select from '@/shared/ui/Select/MyPageSelect';
import { useCallback, useEffect, useState } from 'react';

export default function My() {
  const [isMyInfo, setIsMyInfo] = useState(true);

  function clickToggleButton() {
    setIsMyInfo(prev => !prev);
  }

  const { data, loading, execute } = useFetch(() => userInfo());

  const fetchData = useCallback(() => {
    if (!loading && !data) {
      execute();
    }
  }, [data, loading, execute]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <main className="flex justify-between px-20 py-20">
      <section className="py-20 w-[45%] h-[80%] border-4 border-sub rounded-lg flex flex-col justify-center items-center gap-20">
        <img src={user} className="w-[50%]" />
        <div className="w-[90%] flex flex-col gap-4">
          <Button
            className={`text-left text-2xl font-bold px-4 py-2 ${isMyInfo === true ? 'bg-sub text-white' : ''}`}
            onClick={clickToggleButton}>
            내 정보
          </Button>
          <Button
            className={`text-left text-2xl font-bold px-4 py-2 ${isMyInfo === false ? 'bg-sub text-white' : ''}`}
            onClick={clickToggleButton}>
            멤버십 정보
          </Button>
        </div>
      </section>
      <section className="w-[45%] h-[80%] flex flex-col justify-center gap-4">
        <Input label="이메일" value={data?.user.email || ''} error={''} disabled />
        <Select title="워드프레스 도메인" items={['2020', '2222', '1111', '2223', '3024']} />
        <div className="flex gap-2">
          <Select title="워드프레스 아이디" items={['2020', '2222', '1111', '2223', '3024']} />
          <Input label="워드프레스 비밀번호" placeholder="입력해주세요" value={'12345678'} error={''} disabled />
        </div>
        <Select title="쿠팡파트너스 Access Key" items={['2020', '2222', '1111', '2223', '3024']} />
        <Select title="쿠팡파트너스 Secret Key" items={['2020', '2222', '1111', '2223', '3024']} />
        <Select title="GPT Key" items={['2020', '2222', '1111', '2223', '3024']} />
      </section>
    </main>
  );
}
