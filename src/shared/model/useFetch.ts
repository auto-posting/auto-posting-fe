import { useState, useCallback } from 'react';

interface FetchResponse<T, P> {
  loading: boolean;
  error: boolean | undefined;
  data: T | null;
  execute: (params?: P) => Promise<void>;
}

const useFetch = <T, P>(fetchFunction: (params?: P) => Promise<{ data: T } | undefined>): FetchResponse<T, P> => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean | undefined>(undefined);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(
    async (params?: P) => {
      setLoading(true);
      setError(undefined);

      try {
        const response = await fetchFunction(params);

        if (response?.data) {
          setData(response.data);
        }
      } catch (error) {
        setError(true);
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [fetchFunction]
  );

  return { execute, loading, error, data };
};

export default useFetch;
