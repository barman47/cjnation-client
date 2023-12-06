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
import Loading from '@/components/common/Loading';
import Movies from './Movies';
import { clearMovieErrors, getMoviesByGenre, searchMovies, selectMovieErrors, selectMovies } from '@/redux/features/moviesSlice';
import Categories from '@/components/common/Categories';
import { Categories as CategoryTypes } from '@/utils/constants';
import { getCategoriesByType, selectCategoires, selectCategory, setCategories, setCategory } from '@/redux/features/categoriesSlice';
import { Category } from '@/interfaces';
import { clearMusicErrors, getMusicsByGenre, searchMusic, selectMusicErrors, selectMusics } from '@/redux/features/musicSlice';
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

    const musicErrors = useSelector(selectMusicErrors);
    const movieErrors = useSelector(selectMovieErrors);

    const category = useSelector(selectCategory);
    const categories = useSelector(selectCategoires);
    const movies = useSelector(selectMovies);
    const musics = useSelector(selectMusics);

    const [value, setValue] = React.useState<number | null>(null);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        dispatch(setCategories([]));
        const searchParams = new URLSearchParams(window.location.search);
        const tab = searchParams.get(TAB); // set the tab if the value is in the url on page load. Useful for page refresh
        if (!tab) {
            setValue(0);
            dispatch(getCategoriesByType(CategoryTypes.MOVIE));
        } else if (tab === MOVIES) {
            dispatch(getCategoriesByType(CategoryTypes.MOVIE));
            setValue(0);
        } else {
            dispatch(getCategoriesByType(CategoryTypes.MUSIC));
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

    // Handle Post API error response
    React.useEffect(() => {
        if (!_.isEmpty(movieErrors)) {
            setLoading(false);
            dispatch(setToast({
                type: 'error',
                message: movieErrors.msg!
            }));
            dispatch(clearMovieErrors());
        }
    }, [movieErrors, dispatch]);

    // Handle Post API error response
    React.useEffect(() => {
        if (!_.isEmpty(musicErrors)) {
            setLoading(false);
            dispatch(setToast({
                type: 'error',
                message: musicErrors.msg!
            }));
            dispatch(clearMusicErrors());
        }
    }, [musicErrors, dispatch]);

    const handleSearch = (searchText: string) => {
        if (value === 0) {
            dispatch(searchMovies(searchText));
        }  
        if (value === 1) {
            dispatch(searchMusic(searchText));
        }  
    };

    const debouncedSearch = debounce(handleSearch, 1000);
    
    const handleDownloadSearch = (searchText: string) => {
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

        setValue(newValue);
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