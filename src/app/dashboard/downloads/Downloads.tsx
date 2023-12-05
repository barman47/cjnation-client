'use client';

import * as React from 'react';

import { 
    Box,
    Stack,
    Tab,
    Tabs, 
    Typography
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';

import CustomTabPanel from '@/components/common/CustomTabPanel';
import SearchBox from '@/components/common/SearchBox';
import { LIGHT_GREY } from '@/app/theme';
import { setToast } from '@/redux/features/appSlice';
import { AppDispatch } from '@/redux/store';
import debounce from '@/utils/debounce';
import { clearError, selectPostErrors, selectPostMessage, setPostMessage } from '@/redux/features/postsSlice';
import Loading from '@/components/common/Loading';
import Movies from './Movies';
import { getMoviesByGenre, selectMovies } from '@/redux/features/moviesSlice';
import Categories from '@/components/common/Categories';
import { Categories as CategoryTypes } from '@/utils/constants';
import { getCategoriesByType, selectCategoires, selectCategory, setCategory } from '@/redux/features/categoriesSlice';
import { Category } from '@/interfaces';
import { getMusicsByGenre, selectMusics } from '@/redux/features/musicSlice';
import Musics from './Musics';
import { setQueryParams } from '@/utils/searchQueryParams';

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles()((theme) => ({
    title: {
        fontWeight: 600,

        [theme.breakpoints.down('sm')]: {
            textAlign: 'center'
        }
    },

    header: {
        borderBottom: `1px solid ${LIGHT_GREY}`,
        borderTop: `1px solid ${LIGHT_GREY}`,
        height: theme.spacing(12),
        marginTop: theme.spacing(2),
        paddingTop: theme.spacing(2)
    }
}));

const MOVIES = 'movies';
const MUSIC = 'music';
const TAB = 'tab';
const GENRE = 'genre';

const Downloads: React.FC<{}> = () => {
    const { classes } = useStyles();
    const dispatch: AppDispatch = useDispatch();

    const category = useSelector(selectCategory);
    const categories = useSelector(selectCategoires);
    const movies = useSelector(selectMovies);
    const musics = useSelector(selectMusics);
    const msg = useSelector(selectPostMessage);

    const [searchText, setSearchText] = React.useState('');
    const [previousGenre, setPreviousGenre] = React.useState<{ tab: string; genre: string; }>({ tab: '', genre: '' });
    const [value, setValue] = React.useState<number | null>(null);
    const [loading, setLoading] = React.useState(false);


    const postErrors = useSelector(selectPostErrors);

    React.useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const tab = searchParams.get(TAB);
        if (!tab) {
            setValue(0);
        } else if (tab === MOVIES) {
                setValue(0);
        } else {
            setValue(1);
        }
        // setQueryParams(value);
        // eslint-disable-next-line
    }, []);

 

    // set the category in search params when it changes
    React.useEffect(() => {
        if (!_.isEmpty(category)) {
            setQueryParams(GENRE, category.name.toLowerCase());
        }
    }, [category]);

    React.useEffect(() => {
        if (msg) {
            setLoading(false);
            dispatch(setToast({
                type: 'success',
                message: msg
            }));
            dispatch(setPostMessage(null));
        }
    }, [dispatch, msg]);

    // Handle Post API error response
    React.useEffect(() => {
        if (!_.isEmpty(postErrors)) {
            setLoading(false);
            dispatch(setToast({
                type: 'error',
                message: postErrors.msg!
            }));
            dispatch(clearError());
        }
    }, [postErrors, dispatch]);

    const handleSearch = (searchText: string) => {
        // if (value === 0) {
        //     dispatch(searchForApprovedPosts(searchText));
        // }  
        // if (value === 1) {
        //     dispatch(searchForPendingPosts(searchText));
        // }  
    };

    const debouncedSearch = debounce(handleSearch, 1000);
    
    const handleDownloadSearch = (searchText: string) => {
        setSearchText(searchText);
        const url = new URL(window.location.href);

        if (searchText) {
            url.searchParams.set('text', searchText);
        } else {
            url.searchParams.delete('text');
        }
        window.history.pushState({}, '', url.toString());
        debouncedSearch(searchText);
    };

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        if (newValue === 0) {
            setQueryParams(TAB, MOVIES);
            dispatch(getCategoriesByType(CategoryTypes.MOVIE));
        }

        if (newValue === 1) {
            setQueryParams(TAB, MUSIC);
            dispatch(getCategoriesByType(CategoryTypes.MUSIC));
        }
        const searchParams = new URLSearchParams(window.location.search);

        // setPreviousGenre(prev => {
        //     if (prev) {
        //         setQueryParams(GENRE, prev);
        //     }
        //     return searchParams.get(GENRE) || '';
        // });
        setValue((prevValue) => {
            if (prevValue === 0) {
                // if (previousGenre.tab === MOVIES) {
                //     setQueryParams(GENRE, previousGenre.genre);    
                // }
                setQueryParams(TAB, MOVIES);
                // setPreviousGenre(MOVIES);
            } else {
                // if (previousGenre.tab === MUSIC) {
                //     setQueryParams(GENRE, previousGenre.genre);    
                // }
                setQueryParams(TAB, MUSIC);
                // setPreviousGenre(MUSIC);
            }
            return newValue;
        });
    };

    const handleGetData = (categoryId: string): void => {
        if (value === 0) {
            dispatch(getMoviesByGenre(categoryId));
        }

        if (value === 1) {
            dispatch(getMusicsByGenre(categoryId));
        }
    };

    return (
        <>
            {loading && <Loading />}
            <Box component="main">
                <Typography variant="h5" className={classes.title}>Downloads</Typography>
                <Stack 
                    direction="row" 
                    alignItems="center" 
                    justifyContent="space-between" 
                    className={classes.header}
                >
                    <Box alignSelf="flex-end">
                        <Tabs 
                            value={value} 
                            textColor="primary" 
                            indicatorColor="primary" 
                            onChange={handleChange} 
                            aria-label="post-tabs"
                            sx={{ borderBottom: 1, borderColor: 'divider' }}
                        >
                            <Tab sx={{ textTransform: 'none' }} label="Movies" disableRipple disableFocusRipple {...a11yProps(0)} />
                            <Tab sx={{ textTransform: 'none' }} label="Music" disableRipple disableFocusRipple {...a11yProps(1)} />
                        </Tabs>
                    </Box>
                    <SearchBox searchHandler={handleDownloadSearch} />
                </Stack>
                <br />
                <Categories 
                    categories={categories}
                    searchParamName="genre"
                    setCategory={(category: Category) => {
                        dispatch(setCategory(category));
                    }}
                    getFunction={handleGetData}
                />
                <CustomTabPanel value={value as number} index={0}>
                    <Movies movies={movies} />
                </CustomTabPanel>
                <CustomTabPanel value={value as number} index={1}>
                    <Musics musics={musics} />
                </CustomTabPanel>
            </Box>
        </>
    );
};

export default Downloads;