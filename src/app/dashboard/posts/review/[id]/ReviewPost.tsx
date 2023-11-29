'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { 
    Avatar,
    Box,
    Button,
    CircularProgress,
    Stack,
    Typography,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import parse from 'html-react-parser';
import moment from 'moment';
import _ from 'lodash';

import { OFF_BLACK } from '@/app/theme';
import { capitalize } from '@/utils/capitalize';
import { AppDispatch } from '@/redux/store';
import { approvePost, clearError, getPost, selectIsPostLoading, selectPost, selectPostErrors, selectPostMessage, setPost, setPostMessage } from '@/redux/features/postsSlice';
import { ArrowLeftCircleOutline } from 'mdi-material-ui';
import DeclinePostModal from './DeclinePostModal';
import { ModalRef } from '@/utils/constants';
import { setToast } from '@/redux/features/appSlice';
import { Post } from '@/interfaces';

const useStyles = makeStyles()((theme) => ({
    box: {
        border: '1px solid #0000001A',
        padding: theme.spacing(3)
    },

    title: {
        fontWeight: 600
    },

    author: {
        color: OFF_BLACK,
        fontWeight: 600
    },

    info: {
        color: OFF_BLACK,
        fontWeight: 300
    },

    image: {
        borderRadius: theme.shape.borderRadius,
        width: '100%',
        height: '60vh',
        objectFit: 'cover',
        objectPosition: 'center'
    }
}));

const ReviewPost: React.FC<{}> = () => {
    const { classes } = useStyles();
    const dispatch: AppDispatch = useDispatch();
    const params = useParams();
    const router = useRouter();
    
    const post = useSelector(selectPost);
    const loading = useSelector(selectIsPostLoading);
    const msg = useSelector(selectPostMessage);
    const postErrors = useSelector(selectPostErrors);

    const declinePostModalRef = React.useRef<ModalRef | null>(null);

    React.useEffect(() => {
        return () => {
            dispatch(setPost({} as Post));
        };
    }, [dispatch])

    React.useEffect(() => {
        if (_.isEmpty(post)) {
            dispatch(getPost(params.id.toString()));
        }
    }, [dispatch, params.id, post]);

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

    React.useEffect(() => {
        if (msg) {
            dispatch(setToast({
                type: 'success',
                message: msg,
                autoHideDuration: 4000
            }));
            declinePostModalRef.current?.closeModal();
            dispatch(setPostMessage(null));
            router.replace('/dashboard/admin/home');
        }
    }, [dispatch, msg, router]);

    const handleApprovePost = () => {
        if (window.confirm('Approve Post?')) {
            dispatch(approvePost(post._id!));
        }
    }

    const handleDeclinePost = () => {
        declinePostModalRef.current?.openModal();
    }

    return (
        <>
            <DeclinePostModal ref={declinePostModalRef} />
            {(_.isEmpty(post) && loading) &&
                <Stack direction="column" alignItems="center" justifyContent="center">
                    <CircularProgress />
                    <Typography variant="body2">One Moment . . .</Typography>
                </Stack>
            }
            {(_.isEmpty(post) && !loading) &&
                <Typography variant="h6" align="center">Post does not exist</Typography>
            }
            {!_.isEmpty(post) &&
                <Box component="main">
                    <Button
                        color="secondary"
                        variant="text"
                        size="large"
                        disabled={loading}
                        sx={{ color: OFF_BLACK, marginBottom: '10px' }}
                        onClick={() => router.back()}
                        startIcon={<ArrowLeftCircleOutline />}
                    >
                        Back to Blogs
                    </Button>
                    <Box component="section" className={classes.box}>
                        <Stack direction="column" spacing={3}>
                            <Typography variant="h5" className={classes.title}>{post.title}</Typography>
                            <Image 
                                src={post.mediaUrl!}
                                alt="post title"
                                width={800}
                                height={1200}
                                className={classes.image}
                                loading="lazy"
                            />
                            {parse(post.body)}
                        </Stack>
                    </Box>
                    <Stack direction="row" alignItems="center" spacing={1} className={classes.box} mt={2}>
                        <Avatar />
                        <Typography variant="subtitle2" className={classes.author}>{typeof post.author === 'string' ? post.author : capitalize(post.author.name)}</Typography>
                        <Typography variant="subtitle2" className={classes.info} sx={{ marginLeft: '50px' }}>{moment(post.createdAt).format('MMMM Do, YYYY')}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={3} alignItems="center" justifyContent="center" mt={5}>
                        <Button
                            color="secondary"
                            variant="outlined"
                            size="large"
                            disabled={loading}
                            sx={{ color: OFF_BLACK }}
                            onClick={handleDeclinePost}
                        >
                            {loading ? 'Declining Post . . .' : 'Decline Post'}
                        </Button>
                        <Button
                            color="primary"
                            variant="contained"
                            size="large"
                            disabled={loading}
                            onClick={handleApprovePost}
                        >
                            {loading ? 'Approving Post . . .' : 'Approve Post'}
                        </Button>
                    </Stack>
                </Box>
            }
        </>
    );
};

export default ReviewPost;