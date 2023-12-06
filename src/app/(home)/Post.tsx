'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Avatar, Box, Chip, Stack, Theme, Typography, useMediaQuery, useTheme } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import parse from 'html-react-parser';
import moment from 'moment';

import { DARK_GREY, LIGHT_GREY, OFF_BLACK } from '../theme';
import { Post as PostData } from '@/interfaces';
import { capitalize } from '@/utils/capitalize';

const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        borderBottom: `1px solid ${LIGHT_GREY}`,
        // minHeight: theme.spacing(36),
        padding: theme.spacing(2, 0)
    },

    author: {
        color: OFF_BLACK,
        fontWeight: 600
    },

    title: {
        fontWeight: 700,
        display: '-webkit-box',
        overflow: 'hidden',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 2,

        [theme.breakpoints.down('sm')]: {
            fontSize: theme.spacing(1.5)
        }
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

    text: {
        display: '-webkit-box',
        overflow: 'hidden',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 3,
        margin: '0 !important',

        [theme.breakpoints.down('sm')]: {
            WebkitLineClamp: 2,
            fontSize: theme.spacing(1.5)
        }
    },

    imageContainer: {
        
        width: theme.spacing(70),
        height: theme.spacing(25),
        // height: '55%',
        // width: '100%',

        [theme.breakpoints.down('sm')]: {
            width: theme.spacing(120),
            height: theme.spacing(12)
        }
    },

    postImage: {
        borderRadius: '15px',
        objectPosition: 'center',
        objectFit: 'cover',
        width: '100%',
        height: '100%',

        [theme.breakpoints.down('sm')]: {
            borderRadius: '10px',
        }
    },

    footer: {
        color: DARK_GREY
    },

    dot: {
        backgroundColor: DARK_GREY,
        borderRadius: '50%',
        width: '3px',
        height: '3px'
    }
}));

interface Props {
    post: PostData;
}

const Post: React.FC<Props> = ({ post }) => {
    const { classes } = useStyles();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Stack direction="column" spacing={2} className={classes.root}>
            <Stack direction="row" spacing={2} alignItems="flex-start">
                <Stack direction="column" spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar src={typeof post.author === 'string' ? post.author : post.author.avatar!} />
                        <Typography variant="subtitle2" className={classes.author}>{typeof post.author === 'string' ? post.author : capitalize(post.author.name)}</Typography>
                    </Stack>
                    <Typography variant="h6" className={classes.title}>
                        <Link href={`/posts/${post.slug}/${post._id}`} className={classes.link}>
                            {post.title}
                        </Link>
                    </Typography>
                    <Typography variant="body1" paragraph className={classes.text}>{parse(post.body)}</Typography>
                </Stack>
                <Box component="div" className={classes.imageContainer}>
                    <Image 
                        src={post.mediaUrl!}
                        width={500}
                        height={300}
                        alt={post.title}
                        className={classes.postImage}
                    />
                </Box>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1} justifyContent={matches ? 'space-between' : 'flex-start'} className={classes.footer}>
                <Typography variant="subtitle1">{moment(post.createdAt).format('MMM Do, YYYY')}</Typography>
                <Box component="div" className={classes.dot}></Box>
                <Typography variant="subtitle1">{post.readDuration} min read</Typography>
                <Box component="div" className={classes.dot}></Box>
                <Chip label={typeof post.category === 'string' ? post.category : capitalize(post.category.name)} sx={{ color: OFF_BLACK }} />
            </Stack>
        </Stack>
    );
};

export default Post;