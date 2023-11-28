'use client';

import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Typography
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import _ from 'lodash';

import CreatePostForm from '../../create/CreatePostForm';
import Loading from '@/components/common/Loading';
import { getPost, selectIsPostLoading, selectPost } from '@/redux/features/postsSlice';
import { AppDispatch } from '@/redux/store';
import { useParams } from 'next/navigation';

const useStyles = makeStyles()(theme => ({
    title: {
        fontWeight: 600,
        marginBottom: theme.spacing(3),

        [theme.breakpoints.down('sm')]: {
            textAlign: 'center'
        }
    },
}));

const EditPost: React.FC<{}> = () => {
    const { classes } = useStyles();
    const params = useParams();
    const dispatch: AppDispatch = useDispatch();
    
    const loading = useSelector(selectIsPostLoading);

    const post = useSelector(selectPost);

    React.useEffect(() => {
        if (_.isEmpty(post)) {
            dispatch(getPost(params.id.toString()));
        }
    }, [dispatch, params.id, post]);

    return (
        <Box component="main">
            {loading && <Loading />}
            <Typography variant="h4" className={classes.title}>Edit Post</Typography>
            <CreatePostForm edit={true} />
        </Box>
    );
};

export default EditPost;