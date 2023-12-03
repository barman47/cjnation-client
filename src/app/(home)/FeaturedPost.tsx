'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Box, Stack, Theme, Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

import { OFF_BLACK } from '../theme';
import { Post } from '@/interfaces';
import { capitalize } from 'lodash';

const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        padding: theme.spacing(2, 0)
    },

    author: {
        color: OFF_BLACK,
        fontWeight: 400
    },

    title: {
        fontWeight: 600,
        display: '-webkit-box',
        overflow: 'hidden',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 1
    },

    link: {
        color: 'inherit',
        textDecoration: 'none',
        transition: theme.transitions.create('color', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.short,
        }),

        '&:hover': {
            color: theme.palette.primary.main
        }
    },

    postImage: {
        width: theme.spacing(10),
        height: theme.spacing(10),
        borderRadius: '15px',
        objectPosition: 'center',
        objectFit: 'cover'
    }
}));

interface Props {
    post: Post;
}

const FeaturedPost: React.FC<Props> = ({ post }) => {
    const { classes } = useStyles();

    return (
        <Stack direction="row" spacing={2} alignItems="flex-start" className={classes.root}>
            <Box component="div">
                <Image 
                    src={post.mediaUrl!}
                    width={70}
                    height={70}
                    alt={post.title}
                    className={classes.postImage}
                />
            </Box>
            <Stack direction="column" spacing={2}>
                <Typography variant="h6" className={classes.title}>
                    <Link href={`/posts/${post.slug}/${post._id}`} className={classes.link}>
                        {post.title}
                    </Link>
                </Typography>
                <Typography variant="subtitle2" className={classes.author}>By {typeof post.author === 'string' ? '' : capitalize(post.author.name)}</Typography>
            </Stack>
        </Stack>
    );
};

export default FeaturedPost;