'use client';

import * as React from 'react';

import { Divider, Stack } from '@mui/material';
import _ from 'lodash';

import PublishedPost from './PublishedPost';
import { Post } from '@/interfaces';

interface Props {
    handleDeletePost: (postId: string) => void;
    posts: Post[];
}

const PublishedPosts: React.FC<Props> = ({ handleDeletePost, posts }) => {
    return (
        <Stack 
            direction="column"
            spacing={5}
        > 
            {posts.map((post: Post) => (
                <React.Fragment key={post._id}>
                    <PublishedPost post={post} handleDeletePost={handleDeletePost} />
                    <Divider />
                </React.Fragment>
            ))}
        </Stack>
    );
};

export default PublishedPosts;