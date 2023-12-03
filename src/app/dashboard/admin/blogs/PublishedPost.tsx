'use client';

import * as React from 'react';
import Image from 'next/image';
import NextLink from 'next/link';
import { 
    IconButton,
    Link,
    Stack,
    Typography,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import _ from 'lodash';
import moment from 'moment';

import { Post } from '@/interfaces';
import { Delete } from 'mdi-material-ui';
import { capitalize } from '@/utils/capitalize';


const useStyles = makeStyles()(() => ({
    image: {
        borderRadius: '5px',
        objectFit: 'cover',
        objectPosition: 'center'
    }
}));

interface Props {
    post: Post;
    handleDeletePost: (postId: string) => void;
}

const PublishedPost: React.FC<Props> = ({ post, handleDeletePost }) => {
    const { classes } = useStyles();

    return (
        <Stack 
            direction="row"
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
        > 
            <Stack direction="row" spacing={4}>
                <Image 
                    src={post.mediaUrl!}
                    width={92}
                    height={92}
                    alt="Post Image"
                    className={classes.image}
                />
                <Stack direction="column">
                    <Typography variant="h6">
                        <Link
                            component={NextLink} 
                            href={`/posts/${post.slug}/${post._id}`}
                            underline="hover"
                            
                        >
                            {post.title}
                        </Link>
                    </Typography>
                    <Typography variant="body1">By {typeof post.author === 'string' ? post.author : capitalize(post.author.name)}</Typography>
                    <Typography variant="body2">{moment(post.createdAt).format('MMMM Do, YYYY')}</Typography>
                </Stack>
            </Stack>
            <IconButton onClick={() => handleDeletePost(post._id!)}>
                <Delete />
            </IconButton>
        </Stack>
    );
};

export default PublishedPost;