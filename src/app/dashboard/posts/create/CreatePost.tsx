'use client';

import {
    Box,
    Typography
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useSelector } from 'react-redux';

import CreatePostForm from './CreatePostForm';
import Loading from '@/components/common/Loading';
import { selectIsPostLoading } from '@/redux/features/postsSlice';

const useStyles = makeStyles()(theme => ({
    title: {
        fontWeight: 600,
        marginBottom: theme.spacing(3),

        [theme.breakpoints.down('sm')]: {
            textAlign: 'center'
        }
    },
}));

const CreatePost: React.FC<{}> = () => {
    const { classes } = useStyles();
    const loading = useSelector(selectIsPostLoading);

    return (
        <Box component="main">
            {loading && <Loading />}
            <Typography variant="h4" className={classes.title}>Create Post</Typography>
            <CreatePostForm />
        </Box>
    );
};

export default CreatePost;