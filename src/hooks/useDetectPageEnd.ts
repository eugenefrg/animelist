import { useState, useEffect } from 'react';

/**
 * A custom React hook that detects if the user has scrolled to the end of the current page.
Calls a callback function when the end of the page is reached.
 */
export function useDetectPageEnd(callback: () => void) {
    const [pageEndReached, setPageEndState] = useState(false);

    const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

        setPageEndState(scrollTop + clientHeight >= scrollHeight);
    };

    // set eventListeners
    useEffect(() => {
        document.addEventListener('scroll', handleScroll);

        return () => {
            document.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // when the bottom has been scrolled to
    useEffect(() => {
        if (pageEndReached) {
            callback();
            setPageEndState(false);
        }
    }, [pageEndReached, callback]);

    useEffect(() => {
        handleScroll();
    }, []);

    // also capture when the page is resized
    useEffect(() => {
        const handleResize = () => {
            handleScroll();
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return pageEndReached;
};

export default useDetectPageEnd;
