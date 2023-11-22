'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Avatar, Box, Chip, Stack, Theme, Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

import avatar from '../../../public/assets/avatar.jpeg';
import postImage from '../../../public/assets/avatar.jpeg';
import { DARK_GREY, LIGHT_GREY, OFF_BLACK } from '../theme';

const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        borderBottom: `1px solid ${LIGHT_GREY}`,
        minHeight: theme.spacing(36),
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
        '-webkit-box-orient': 'vertical',
        WebkitLineClamp: 2
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
        '-webkit-box-orient': 'vertical',
        WebkitLineClamp: 3
    },

    imageContainer: {
        
        width: theme.spacing(150),
        height: theme.spacing(25)
        // height: '55%',
        // width: '100%'
    },

    postImage: {
        borderRadius: '15px',
        objectPosition: 'center',
        objectFit: 'cover',
        width: '100%',
        height: '100%'
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

const Post: React.FC<{}> = () => {
    const { classes } = useStyles();

    return (
        <Stack direction="row" spacing={2} alignItems="flex-start" className={classes.root}>
            <Stack direction="column" spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Avatar src={avatar.src} />
                    <Typography variant="subtitle2" className={classes.author}>John Akano</Typography>
                </Stack>
                <Typography variant="h6" className={classes.title}>
                    <Link href="/" className={classes.link}>
                        Doing business in Doing Busines in the 21st Century Doing business in Doing Busines in the 21st Century Doing business in Doing Busines in the 21st Century
                    </Link>
                </Typography>
                <Typography variant="body1" paragraph className={classes.text}>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laborum tempora iusto omnis laboriosam doloribus repellendus dignissimos nisi impedit incidunt, earum adipisci magni nesciunt sapiente reprehenderit enim beatae, asperiores sed neque.</Typography>
                <Stack direction="row" alignItems="center" spacing={1} className={classes.footer}>
                    <Typography variant="subtitle1">Aug 22</Typography>
                    <Box component="div" className={classes.dot}></Box>
                    <Typography variant="subtitle1">10 min read</Typography>
                    <Box component="div" className={classes.dot}></Box>
                    <Chip label="Business" sx={{ color: OFF_BLACK }} />
                </Stack>
            </Stack>
            <Box component="div" className={classes.imageContainer}>
                <Image 
                    src={postImage.src}
                    width={500}
                    height={300}
                    alt="Post image"
                    className={classes.postImage}
                />
            </Box>
        </Stack>
    );
};

export default Post;