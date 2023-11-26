'use client';

import * as React from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { 
    Avatar,
    Box,
    Chip,
    Stack,
    Typography,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import parse from 'html-react-parser';
import moment from 'moment';
import _ from 'lodash';

import { Like, Post as PostData } from '@/interfaces';
import { ChatOutline, HeartOutline, TrayArrowUp } from 'mdi-material-ui';

import { DARK_GREY, OFF_BLACK } from '@/app/theme';
import { capitalize } from '@/utils/capitalize';
import { AppDispatch } from '@/redux/store';
import { addLike, clearError, removeLike, selectIsLikesLoading, selectLikesErrors, selectLikesMessage, setLikesMessage } from '@/redux/features/likesSlice';
import { useRouter } from 'next/navigation';
import { setToast } from '@/redux/features/appSlice';
import { selectUser } from '@/redux/features/authSlice';
import { userLikedPost } from '@/utils/userLikedPost';

const useStyles = makeStyles()((theme) => ({
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

    dot: {
        backgroundColor: DARK_GREY,
        borderRadius: '50%',
        width: '3px',
        height: '3px'
    },

    image: {
        borderRadius: theme.shape.borderRadius,
        width: '100%',
        height: '60vh',
        objectFit: 'cover',
        objectPosition: 'center'
    }
}));

interface Props {
    post: PostData;
    likes: Like[];
}
const Post: React.FC<Props> = ({ post, likes }) => {
    const { classes } = useStyles();
    const dispatch: AppDispatch = useDispatch();
    const router = useRouter();
    
    const loading = useSelector(selectIsLikesLoading);
    const msg = useSelector(selectLikesMessage);
    const likesError = useSelector(selectLikesErrors);
    const user = useSelector(selectUser);

    const likedPost = (userLikedPost(likes, user._id!));

    // Handle API error response
    React.useEffect(() => {
        if (!_.isEmpty(likesError)) {
            dispatch(setToast({
                type: 'error',
                message: likesError.msg!
            }));
            dispatch(clearError());
        }
    }, [likesError, dispatch]);

    React.useEffect(() => {
        if (msg) {
            router.refresh();
            dispatch(setLikesMessage(null));
        }
    }, [dispatch, msg, router]);
    

    return (
        <Box component="section">
            <Stack direction="column" spacing={3}>
                <Typography variant="h5" className={classes.title}>{post.title}</Typography>
                <Stack direction="row" spacing={1}>
                    <Avatar />
                    <Stack direction="column">
                        <Typography variant="subtitle2" className={classes.author}>{typeof post.author === 'string' ? post.author : capitalize(post.author.name)}</Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="subtitle2" className={classes.info}>{moment(post.createdAt).format('MMMM Do, YYYY')}</Typography>
                            <Box component="div" className={classes.dot}></Box>
                            <Typography variant="subtitle2" className={classes.info}>{post.readDuration} min read</Typography>
                        </Stack>
                    </Stack>
                </Stack>
                <Image 
                    src={post.mediaUrl!}
                    alt="post title"
                    width={800}
                    height={1200}
                    className={classes.image}
                />
                {parse(post.body)}
                <Stack direction="row" spacing={3}>
                    <Chip 
                        icon={<HeartOutline />} 
                        label={post.likes} 
                        onClick={() => {
                            if (likedPost) {
                                dispatch(removeLike(post._id!));
                            } else {
                                dispatch(addLike(post._id!));
                            }
                        }}
                        disabled={loading}
                        color={likedPost ? 'primary' : 'default'}
                    />
                    <Chip icon={<ChatOutline />} label={post.comments} onClick={() => {}} />
                    <Chip icon={<TrayArrowUp />} onClick={() => {}} />
                </Stack>
            </Stack>
        </Box>
    );
};

export default Post;