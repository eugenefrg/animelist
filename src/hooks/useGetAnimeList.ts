import { useState, useEffect } from 'react';
import axios from 'axios';
import { config } from '@/config';
import { Anime } from '@/types/anime';

/**
 * A custom hook to fetch anime data from the API.
 *
 * @returns an object containing anime data, loading state, error state, and a refetch function to update data.
 */
const useGetAnimeList = () => {
    /**
     * State variables to keep track of the anime data, loading state, error state, and current page.
     */
    const [data, setData] = useState<Anime[] | undefined>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState<number>(0)

    /**
     * Fetch anime data from the API
     * @param offset an optional number representing the offset from which to start fetching data.
     */
    const fetchData = async (offset?: number) => {
        try {
            const pageSize = 10;
            const queryParams = `?page[limit]=${pageSize}&page[offset]=${(offset || 0) * pageSize}`
            const response = await axios.get(`${config.apiUrl}anime${queryParams}`);
            setData((anime) => {
                if (anime === undefined) {
                    return response.data.data
                } else {
                    const toInsert = response.data.data.filter((newAnime: Anime) => {
                        return !anime?.find((currentAnime) => currentAnime.id === newAnime.id)
                    })
                    return [...anime, ...toInsert]
                }
            });
            setLoading(false);
        } catch (error) {
            setError(error as any);
            setLoading(false);
        }
    };

    /**
     * Fetch data on initial render.
     */
    useEffect(() => {
        fetchData();
    }, []);

    /**
     * Refetch data when the current page changes.
     */
    const refetch = async () => {
        setLoading(true);
        setCurrentPage((page) => page + 1)
        await fetchData(currentPage)
    }

    return { data, loading, error, refetch };
};

export default useGetAnimeList;