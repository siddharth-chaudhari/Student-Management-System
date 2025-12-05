import { useState, useEffect } from 'react';

export const useSWR = (key, fetcher) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const result = await fetcher();
            setData(result);
            setError(null);
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [key]);

    const mutate = async (updateFn) => {
        if (updateFn) {
            const newData = await updateFn(data);
            setData(newData);
        } else {
            await fetchData();
        }
    };

    return { data, error, isLoading, mutate };
};