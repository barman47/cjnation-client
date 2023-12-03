'use client';

import * as React from 'react';

import { Divider, Stack, Typography } from '@mui/material';
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
            {posts.length ? 
                    <>
                        {posts.map((post: Post) => (
                            <React.Fragment key={post._id}>
                                <PublishedPost post={post} handleDeletePost={handleDeletePost} />
                                <Divider />
                            </React.Fragment>
                        ))}
                    </>
                    :
                    <Typography variant="body2">There are no posts found</Typography>
                }
            
        </Stack>
    );
};

export default PublishedPosts;