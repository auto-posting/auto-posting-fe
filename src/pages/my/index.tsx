import user from '@/assets/svgs/user.svg';
import { deleteCoupangPartners, getCoupangPartners } from '@/features/coupangPartners/api';
import { userInfo } from '@/features/myInfo/api/userApi';
import useFetch from '@/shared/model/useFetch';
import Button from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';
import { useCallback, useEffect, useState } from 'react';
import useModal from '@/shared/model/useModal';
import Table from '@/shared/ui/Table';
import { COUPANG_THEAD } from '@/features/coupangPartners/config/constants';
import { OPENAI_THEAD } from '@/features/openAi/config/constants';
import { deleteOpenai, getOpenai } from '@/features/openAi/api';
import { deleteWordpress, getWordpress } from '@/features/wordPress/api';
import { WORDPRESS_THEAD } from '@/features/wordPress/config/constants';

export default function My() {
  const [isMyInfo, setIsMyInfo] = useState(true);

  function clickToggleButton() {
    setIsMyInfo(prev => !prev);
  }

  const { data: userInfoData, loading: userInfoLoading, execute: userInfoExecute } = useFetch(() => userInfo());
  const { data: coupangData, loading: coupangLoading, execute: coupangExecute } = useFetch(() => getCoupangPartners());
  const { data: openaiData, loading: openaiLoading, execute: openaiExecute } = useFetch(() => getOpenai());
  const { data: wordpressData, loading: wordpressLoading, execute: wordpressExecute } = useFetch(() => getWordpress());

  const { execute: deleteCoupangExecute } = useFetch((params?: { coupangpartners_id: number }) => {
    if (!params) {
      console.error('Params are undefined');
      return Promise.reject(new Error('Params are undefined'));
    }
    return deleteCoupangPartners(params);
  });
  const { execute: deleteOpenaiExecute } = useFetch((params?: { openai_id: number }) => {
    if (!params) {
      console.error('Params are undefined');
      return Promise.reject(new Error('Params are undefined'));
    }
    return deleteOpenai(params);
  });
  const { execute: deleteWordpressExecute } = useFetch((params?: { wordpress_id: number }) => {
    if (!params) {
      console.error('Params are undefined');
      return Promise.reject(new Error('Params are undefined'));
    }
    return deleteWordpress(params);
  });

  const { open } = useModal();

  const fetchUserData = useCallback(() => {
    if (!userInfoLoading && !userInfoData) {
      userInfoExecute();
    }
  }, [userInfoData, userInfoLoading, userInfoExecute]);

  const handleCoupangDelete = async (rowIndex: number) => {
    const coupangpartnersId = Number(coupangData?.data[rowIndex].id);

    if (coupangpartnersId !== undefined) {
      try {
        await deleteCoupangExecute({ coupangpartners_id: coupangpartnersId });
        coupangExecute();
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleOpenaiDelete = async (rowIndex: number) => {
    const openaiId = Number(openaiData?.data[rowIndex].id);

    if (openaiId !== undefined) {
      try {
        await deleteOpenaiExecute({ openai_id: openaiId });
        openaiExecute();
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleWordpressDelete = async (rowIndex: number) => {
    const openaiId = Number(openaiData?.data[rowIndex].id);

    if (openaiId !== undefined) {
      try {
        await deleteWordpressExecute({ wordpress_id: openaiId });
        wordpressExecute();
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const fetchCoupangData = useCallback(() => {
    if (!coupangLoading && !coupangData) {
      coupangExecute();
    }
  }, [coupangData, coupangLoading, coupangExecute]);

  const fetchOpenaiData = useCallback(() => {
    if (!openaiLoading && !openaiData) {
      openaiExecute();
    }
  }, [openaiData, openaiLoading, openaiExecute]);

  const fetchWordpressData = useCallback(() => {
    if (!wordpressLoading && !wordpressData) {
      wordpressExecute();
    }
  }, [wordpressData, wordpressLoading, wordpressExecute]);

  useEffect(() => {
    fetchUserData();
    fetchOpenaiData();
    fetchCoupangData();
    fetchWordpressData();
  }, [fetchUserData, fetchOpenaiData, fetchCoupangData, fetchWordpressData]);

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
        <Input label="이메일" value={userInfoData?.user.email || ''} error={''} disabled />
        <div className="flex flex-col gap-1">
          <div className="flex justify-between">
            <h2>워드프레스</h2>
            <button onClick={() => open('wordpress')} className="px-1 border bg-sub text-white font-bold rounded-lg">
              추가
            </button>
          </div>
          <Table theadData={WORDPRESS_THEAD} tbodyData={wordpressData?.data} onDelete={handleWordpressDelete} />
        </div>
        <div className="flex flex-col gap-1 pb-2">
          <div className="flex justify-between">
            <h2>쿠팡파트너스</h2>
            <button onClick={() => open('coupang')} className="px-1 border bg-sub text-white font-bold rounded-lg">
              추가
            </button>
          </div>
          <Table theadData={COUPANG_THEAD} tbodyData={coupangData?.data} onDelete={handleCoupangDelete} />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between">
            <h2>GPT</h2>
            <button onClick={() => open('openai')} className="px-1 border bg-sub text-white font-bold rounded-lg">
              추가
            </button>
          </div>
          <Table theadData={OPENAI_THEAD} tbodyData={openaiData?.data} onDelete={handleOpenaiDelete} />
        </div>
      </section>
    </main>
  );
}
