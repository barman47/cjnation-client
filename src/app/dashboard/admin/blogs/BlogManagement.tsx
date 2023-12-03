'use client';

import * as React from 'react';

import { 
    Box,
    Button,
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
import { LIGHT_GREY, SECONDARY_COLOR } from '@/app/theme';
import { ModalRef } from '@/utils/constants';
import { setToast } from '@/redux/features/appSlice';
import { AppDispatch } from '@/redux/store';
import { useQueryState } from 'next-usequerystate';
import debounce from '@/utils/debounce';
import { clearError, deletePost, getPendingPosts, getApprovedPosts, selectPostErrors, selectPostMessage, selectPosts, setPostMessage, setPosts, searchForApprovedPosts, searchForPendingPosts } from '@/redux/features/postsSlice';
import { Plus } from 'mdi-material-ui';
import PendingPosts from './PendingPosts';
import PublishedPosts from './PublishedPosts';
import Loading from '@/components/common/Loading';
import AddCategoryModal from './AddCategoryModal';

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

const BlogManagement: React.FC<{}> = () => {
    const { classes } = useStyles();
    const dispatch: AppDispatch = useDispatch();

    const posts = useSelector(selectPosts);
    const msg = useSelector(selectPostMessage);

    const [searchText, setSearchText] = useQueryState('text');

    const [value, setValue] = React.useState(0);
    const [loading, setLoading] = React.useState(false);

    const addCategoryModal = React.useRef<ModalRef | null>(null);

    const postErrors = useSelector(selectPostErrors);

    React.useEffect(() => {
        if (searchText) {
            handleSearchPosts(searchText);
        }

        // eslint-disable-next-line
    }, []);

    React.useEffect(() => {
        dispatch(setPosts([]));
        if (value === 0) {
            dispatch(getApprovedPosts());
        }

        if (value === 1) {
            dispatch(getPendingPosts());
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
        console.log(searchText)
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
        debouncedSearch(searchText);
    };

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleOpenAddCategoryModal = (): void => {
        addCategoryModal.current?.openModal()
    };

    const handleDeletePost = (postId: string): void => {
        if (confirm('Delete Post?')) {
            setLoading(true);
            dispatch(deletePost(postId));
        }
    };

    return (
        <>
            {loading && <Loading />}
            <AddCategoryModal ref={addCategoryModal} />
            <Box component="main">
                <Typography variant="h5" className={classes.title}>Downloads Management</Typography>
                <Stack 
                    direction="row" 
                    alignItems="flex-end" 
                    justifyContent="space-between" 
                    className={classes.header}
                >
                    <Box>
                        <Tabs 
                            value={value} 
                            textColor="primary" 
                            indicatorColor="primary" 
                            onChange={handleChange} 
                            aria-label="post-tabs"
                            sx={{ borderBottom: 1, borderColor: 'divider' }}
                        >
                            <Tab sx={{ textTransform: 'none' }} label="Published" disableRipple disableFocusRipple {...a11yProps(0)} />
                            <Tab sx={{ textTransform: 'none' }} label="New Submissions" disableRipple disableFocusRipple {...a11yProps(1)} />
                        </Tabs>
                    </Box>
                    <Stack direction="row" spacing={5} alignItems="center" alignSelf="flex-start">
                        <SearchBox searchHandler={handleSearchPosts} />
                        <Button
                            variant="outlined"
                            color="secondary"
                            size="large"
                            sx={{ color: SECONDARY_COLOR }}
                            onClick={handleOpenAddCategoryModal}
                            startIcon={<Plus />}
                        >
                            Add Blog Category
                        </Button>
                    </Stack>
                </Stack>
                <CustomTabPanel value={value} index={0}>
                    <PublishedPosts handleDeletePost={handleDeletePost} posts={posts} />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <PendingPosts />
                </CustomTabPanel>
            </Box>
        </>
    );
};

export default BlogManagement;