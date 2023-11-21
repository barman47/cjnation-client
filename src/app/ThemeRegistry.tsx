'use client';
import { useState } from 'react';
import  createCache from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
// import { useDispatch } from 'react-redux';

import { theme } from './theme';
// import { getCurrentUser } from '@/redux/features/authSlice';
// import { AppDispatch } from '@/redux/store';
// import setAuthToken from '@/utils/setAuthToken';
// import { TOKEN_VALUE } from '@/utils/constants';

type ThemeRegistryProps = {
    children: React.ReactNode;
    options: {
        key: string;
        prepend?: boolean;
    };
};

export default function ThemeRegistry({
    children,
    options
}: ThemeRegistryProps) {
    // const dispatch: AppDispatch = useDispatch();

    const [{ cache, flush }] = useState(() => {
        const cache = createCache({ key: 'my' });
        cache.compat = true;
        const prevInsert = cache.insert;
        let inserted: string[] = [];
        cache.insert = (...args) => {
            const serialized = args[1];
            if (cache.inserted[serialized.name] === undefined) {
                inserted.push(serialized.name);
            }
            return prevInsert(...args);
        };
        const flush = () => {
            const prevInserted = inserted;
            inserted = [];
            return prevInserted;
        };
        return { cache, flush };
    });

    useServerInsertedHTML(() => {
        const names = flush();
        if (names.length === 0) {
            return null
        }
        let styles = '';
        for (const name of names) {
            styles += cache.inserted[name];
        }
        return (
            <style
                data-emotion={`${cache.key} ${names.join(' ')}`}
                dangerouslySetInnerHTML={{
                    __html: options.prepend ? `@layer emotion {${styles}}` : styles,
                }}
            />
        );
    });
        
    // useEffect(() => {
    //     const authToken = localStorage.getItem(TOKEN_VALUE);
    //     if (authToken) {
    //         setAuthToken(authToken);
    //         dispatch(getCurrentUser());
    //     }
    // }, [dispatch]);

    return (
        <CacheProvider value={cache}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </CacheProvider>
    );
}