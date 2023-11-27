'use client';

import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    Box, 
    Typography,
    Theme,
    Avatar,
    Button,
    Stack,
    Tabs,
    Tab,
    Paper,
    Menu,
    MenuList,
    MenuItem,
    ListItemIcon,
    ListItemText,
    useTheme,
    useMediaQuery,
    CircularProgress
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import _ from 'lodash';

import { selectIsUserAuthenticated, selectUser } from '@/redux/features/authSlice';
import { PRIMARY_COLOR } from '@/app/theme';
import { ContentCut, DeleteOutline, EyeOutline, NewspaperVariantMultipleOutline, PencilOutline } from 'mdi-material-ui';
import { capitalize } from '@/utils/capitalize';
import ProfilePost from './ProfilePost';
import ProfileUpdateModal from './ProfileUpdateModal';
import { ModalRef, PostStatus } from '@/utils/constants';
import { AppDispatch } from '@/redux/store';
import { clearError, deletePost, getPostsForUser, publishPost, selectIsPostLoading, selectPostErrors, selectPostMessage, selectPosts, setPost, setPostMessage } from '@/redux/features/postsSlice';
import { setToast } from '@/redux/features/appSlice';
import { Post } from '@/interfaces';
import moment from 'moment';
import { useRouter } from 'next/navigation';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}
  
function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}
  
  function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
  }

const useStyles = makeStyles()((theme: Theme) => ({
    title: {
        fontWeight: 600,

        [theme.breakpoints.down('sm')]: {
            textAlign: 'center'
        }
    },

    avatar: {
        backgroundColor: PRIMARY_COLOR,
        fontSize: theme.spacing(10),
        height: theme.spacing(25), 
        width: theme.spacing(25), 

        [theme.breakpoints.down('sm')]: {
            width: theme.spacing(15), 
            height: theme.spacing(15), 
        }
    },

    name: {
        textTransform: 'capitalize',

        [theme.breakpoints.down('sm')]: {
            textAlign: 'center'
        }
    }
}));

const Profile: React.FC<{}> = () => {
    const { classes } = useStyles();
    const dispatch: AppDispatch = useDispatch();
    const router = useRouter();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    const loading = useSelector(selectIsPostLoading);
    const posts = useSelector(selectPosts);
    const postErrors = useSelector(selectPostErrors);
    const msg = useSelector(selectPostMessage);
    const user = useSelector(selectUser);
    const isAuthenticated = useSelector(selectIsUserAuthenticated);

    const [value, setValue] = React.useState(0);
    const [showEdit, setShowEdit] = React.useState(false);
    const [showPublish, setShowPublish] = React.useState(false);
    const [showViewPost, setShowViewPost] = React.useState(false);
    const [postId, setPostId] = React.useState('');

    const profileUpdateModalRef = React.useRef<ModalRef | null>(null);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    React.useEffect(() => {
        if (isAuthenticated) {
            dispatch(getPostsForUser());
        }
    }, [dispatch, isAuthenticated]);

    React.useEffect(() => {
        if (msg) {
            dispatch(setToast({
                type: 'success',
                message: msg
            }));
            dispatch(setPostMessage(null));
        }
    }, [dispatch, msg]);

    // Handle API error response
    React.useEffect(() => {
        if (!_.isEmpty(postErrors)) {
            dispatch(setToast({
                type: 'error',
                message: postErrors.msg!
            }));
            dispatch(clearError());
        }
    }, [postErrors, dispatch]);
    
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>, postId: string, postStatus: PostStatus) => {
        setPostId(postId);
        if (postStatus === PostStatus.DRAFT) {
            setShowEdit(true);
            setShowPublish(true);
        }
        if (postStatus === PostStatus.APPROVED) {
            setShowViewPost(true);
        }

        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        if (showEdit) {
            setShowEdit(false);
        }
        if (showPublish) {
            setShowPublish(false);
        }
        if (showViewPost) {
            setShowViewPost(false);
        }
        setPostId('');
        setAnchorEl(null);
    };

    const handleDeletePost = (): void => {
        if (confirm('Delete this post? This action is not reversible.')) {
            dispatch(deletePost(postId));
        }
        handleClose();
    };

    const handleEditPost = (): void => {
        const post = posts.find((item: Post) => item._id === postId)!;
        dispatch(setPost(post));
        router.push(`/dashboard/posts/edit/${postId}`);
    };

    const handlePublishPost = (): void => {
        dispatch(publishPost(postId));
        handleClose();
    };

    const handleViewPost = (): void => {
        const post = posts.find((item: Post) => item._id === postId)!;
        router.push(`/posts/${post?.slug}/${post._id}`);
    };

    return (
        <>
            <ProfileUpdateModal ref={profileUpdateModalRef} />
            <Box component="main">
                <Typography variant="h4" className={classes.title}>Profile</Typography>
                <Stack direction={matches ? 'column' : 'row'} spacing={ matches ? 2 : 5} alignItems="center" component="section" mt={matches ? 2 : 6}>
                    <Avatar 
                        className={classes.avatar}
                        src={user.avatar!}
                        alt={user.name} 
                    />
                    <Button
                        variant="text"
                        color="primary"
                        size="large"
                        startIcon={<PencilOutline />}
                        onClick={() => profileUpdateModalRef.current?.openModal()}
                    >
                        Edit Profile
                    </Button>
                </Stack>

                <Typography variant="h6" mt={3} className={classes.name}>{capitalize(user.name)}</Typography>

                <Box>
                    <Tabs 
                        value={value} 
                        textColor="primary" 
                        indicatorColor="primary" 
                        onChange={handleChange} 
                        aria-label="post-tabs"
                        sx={{ borderBottom: 1, borderColor: 'divider' }}
                    >
                        <Tab sx={{ textTransform: 'none' }} label="Blog Posts" disableRipple disableFocusRipple {...a11yProps(0)} />
                        <Tab sx={{ textTransform: 'none' }} label="Drafts" disableRipple disableFocusRipple {...a11yProps(1)} />
                    </Tabs>
                    <CustomTabPanel value={value} index={0}>
                        {loading && <CircularProgress />}
                        {posts.map((post: Post) => {
                            if (post.status === PostStatus.APPROVED || post.status === PostStatus.PUBLISHED) {
                                return (
                                    <ProfilePost
                                        key={post._id}
                                        title={post.title}
                                        createdAt={moment(post.createdAt).fromNow()}
                                        handleClick={(e) => handleClick(e, post._id!, post.status)}
                                        loading={loading}
                                    />
                                );
                            }
                        })}
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                        {loading && <CircularProgress />}
                        {posts.map((post: Post) => {
                            if (post.status === PostStatus.DRAFT) {
                                return (
                                    <ProfilePost
                                        key={post._id}
                                        title={post.title}
                                        createdAt={moment(post.createdAt).fromNow()}
                                        handleClick={(e) => handleClick(e, post._id!, post.status)}
                                        loading={loading}
                                    />
                                );
                            }
                        })}
                    </CustomTabPanel>
                </Box>
                <Paper sx={{ width: 320, maxWidth: '100%' }}>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                    >
                    <MenuList>
                        <MenuItem onClick={handleViewPost} disabled={!showViewPost}>
                            <ListItemIcon>
                                <EyeOutline fontSize="medium" />
                            </ListItemIcon>
                            <ListItemText>View Post</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={handleEditPost} disabled={!showEdit}>
                            <ListItemIcon>
                                <ContentCut fontSize="medium" />
                            </ListItemIcon>
                            <ListItemText>Edit Post</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={handlePublishPost} disabled={!showPublish}>
                            <ListItemIcon>
                                <NewspaperVariantMultipleOutline fontSize="medium" />
                            </ListItemIcon>
                            <ListItemText>Publish Post</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={handleDeletePost}>
                            <ListItemIcon sx={{ color: theme.palette.error.main }}>
                                <DeleteOutline fontSize="medium" />
                            </ListItemIcon>
                            <ListItemText sx={{ color: theme.palette.error.main }}>Delete Post</ListItemText>
                        </MenuItem>
                    </MenuList>
                    </Menu>
                </Paper>
            </Box>
        </>
    );
};

export default Profile;