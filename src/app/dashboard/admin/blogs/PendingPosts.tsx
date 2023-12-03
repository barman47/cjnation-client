'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Stack,
    Typography
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useDispatch, useSelector } from 'react-redux';

import PendingPost from './PendingPost';
import { selectPosts, setPost } from '@/redux/features/postsSlice';
import { Post } from '@/interfaces';
import { AppDispatch } from '@/redux/store';

const useStyles = makeStyles()((theme) => ({
    root: {
        marginTop: theme.spacing(5)
    },

    container: {
        borderRadius: theme.shape.borderRadius,
        boxShadow: '0px 1px 2px 0px #1018280F, 0px 1px 3px 0px #1018281A',
        marginTop: theme.spacing(2),
        padding: theme.spacing(2)
    },

    post: {
        borderRadius: theme.shape.borderRadius
    }
}));

interface Props {
    showTitle?: boolean
}

const PendingPosts: React.FC<Props> = ({ showTitle }) => {
    const { classes } = useStyles();
    const dispatch: AppDispatch = useDispatch();
    const router = useRouter();

    const pendingPosts = useSelector(selectPosts);

    const handleReviewPost = (post: Post) => {
        dispatch(setPost(post));
        router.push(`/dashboard/posts/review/${post._id}`);
    };

    return (
        <Box component="div" className={classes.root}>
            {showTitle && <Typography variant="h6" sx={{ marginTop: 5 }}>New Submissions</Typography>}
                {pendingPosts.length ? 
                    <Stack direction="column" spacing={2} className={classes.container}>
                        {pendingPosts.map((post: Post) => (
                            <PendingPost key={post._id} post={post} handleReviewPost={handleReviewPost} />
                        ))}
                    </Stack>
                    :
                    <Typography variant="body2">There are no posts for review</Typography>
                }
        </Box >
    );
};

export default PendingPosts;