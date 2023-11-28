'use client';

import * as React from 'react';
import {
    Avatar,
    Box,
    Button,
    Stack,
    Typography
} from '@mui/material';
import { GREY } from '@/app/theme';
import { Post } from '@/interfaces';
import moment from 'moment';

interface Props {
    post: Post;
    handleReviewPost: (post: Post) => void;
}

const PendingPost: React.FC<Props> = ({ post, handleReviewPost }) => {
    const [showButton, setShowButton] = React.useState(false);

    return (
        <Box 
            component="section" 
            onMouseOver={() => setShowButton(true)}
            onMouseLeave={() => setShowButton(false)}
        >
            <Stack 
                direction="row" 
                borderRadius={1} 
                justifyContent="space-between" 
                alignItems="center" 
                sx={{ padding: 2, backgroundColor: GREY }}
            >
                <Avatar src={typeof post.author === 'string' ? '' : post.author.avatar!} />
                <Typography variant="subtitle2">{post.title}</Typography>
                <Typography variant="subtitle2">{moment(post.createdAt).format('MMM Do, YYYY')}</Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    sx={{ visibility: showButton ? 'visible' : 'hidden' }}
                    onClick={() => handleReviewPost(post)}
                >
                    Review
                </Button>
            </Stack>
        </Box>
    );
};

export default PendingPost;