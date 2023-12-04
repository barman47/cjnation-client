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
import { clearError, selectPostErrors, selectPostMessage, setPostMessage, searchForApprovedPosts, searchForPendingPosts } from '@/redux/features/postsSlice';
import Loading from '@/components/common/Loading';
import Movies from './Movies';
import { getMoviesByGenre, selectMovies } from '@/redux/features/moviesSlice';
import Categories from '@/components/common/Categories';
import { Categories as CategoryTypes } from '@/utils/constants';
import { getCategoriesByType, selectCategoires, setCategory } from '@/redux/features/categoriesSlice';
import { Category } from '@/interfaces';
import { getMusicsByGenre } from '@/redux/features/musicSlice';

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

const Downloads: React.FC<{}> = () => {
    const { classes } = useStyles();
    const dispatch: AppDispatch = useDispatch();

    const categories = useSelector(selectCategoires);
    const movies = useSelector(selectMovies);
    const msg = useSelector(selectPostMessage);

    const [searchText, setSearchText] = React.useState('');

    const [value, setValue] = React.useState(0);
    const [loading, setLoading] = React.useState(false);


    const postErrors = useSelector(selectPostErrors);

    React.useEffect(() => {
        if (searchText) {
            handleSearch(searchText);
        }
        // if (categories.length === 0) {
        //     dispatch(getCategoriesByType());
        // }
        // eslint-disable-next-line
    }, []);

    // Get categories depending on whether music or movies tab is selected
    React.useEffect(() => {
        if (value === 0) {
            dispatch(getCategoriesByType(CategoryTypes.MOVIE));
        }

        if (value === 1) {
            dispatch(getCategoriesByType(CategoryTypes.MUSIC));
        }
    }, [dispatch, value]);

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
        if (value === 0) {
            dispatch(searchForApprovedPosts(searchText));
        }  
        if (value === 1) {
            dispatch(searchForPendingPosts(searchText));
        }  
    };

    const debouncedSearch = debounce(handleSearch, 1000);
    
    const handleSearchPosts = (searchText: string) => {
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
                    <SearchBox searchHandler={handleSearchPosts} />
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
                <CustomTabPanel value={value} index={0}>
                    <Movies movies={movies} />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    {/* <PendingPosts /> */}
                </CustomTabPanel>
            </Box>
        </>
    );
};

export default Downloads;