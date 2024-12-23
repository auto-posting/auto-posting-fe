import { useState, useCallback } from 'react';

interface FetchResponse<T> {
  loading: boolean;
  error: boolean | undefined;
  data: T | null;
  execute: () => void;
}

const useFetch = <T>(fetchFunction: () => Promise<{ data: T } | undefined>): FetchResponse<T> => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean | undefined>(undefined);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(async () => {
    if (loading || data) return;

    setLoading(true);
    setError(undefined);

    try {
      const response = await fetchFunction();

      if (response && response.data) {
        setData(response.data);
      } else {
        setData(null);
      }
    } catch (error) {
      setError(true);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [loading, data, fetchFunction]);

  return { execute, loading, error, data };
};

export default useFetch;
