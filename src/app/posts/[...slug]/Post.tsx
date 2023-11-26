'use client';

import Image from 'next/image';

import { 
    Avatar,
    Box,
    Chip,
    Stack,
    Typography,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';

import { Post as PostData } from '@/interfaces';
import { ChatOutline, HeartOutline, TrayArrowUp } from 'mdi-material-ui';

import image from '../../../../public/assets/post.jpg';
import { DARK_GREY, GREY, OFF_BLACK } from '@/app/theme';

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
    post?: PostData
}
const Post: React.FC<Props> = ({ post }) => {
    const { classes } = useStyles();

    return (
        <Box component="section">
            <Stack direction="column" spacing={3}>
                <Typography variant="h5" className={classes.title}>Doing Business in the 21st Century: Adaptation and Innovation</Typography>
                <Stack direction="row" spacing={1}>
                    <Avatar />
                    <Stack direction="column">
                        <Typography variant="subtitle2" className={classes.author}>John Akano</Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="subtitle2" className={classes.info}>Aug 22nd, 2023</Typography>
                            <Box component="div" className={classes.dot}></Box>
                            <Typography variant="subtitle2" className={classes.info}>10 min read</Typography>
                        </Stack>
                    </Stack>
                </Stack>
                <Image 
                    src={image.src}
                    alt="post title"
                    width={800}
                    height={1200}
                    className={classes.image}
                />
                {/* Blog content here */}
                <Stack direction="row" spacing={3}>
                    <Chip icon={<HeartOutline />} label="100" onClick={() => {}} />
                    <Chip icon={<ChatOutline />} label="32" onClick={() => {}} />
                    <Chip icon={<TrayArrowUp />} onClick={() => {}} />
                </Stack>
            </Stack>
        </Box>
    );
};

export default Post;