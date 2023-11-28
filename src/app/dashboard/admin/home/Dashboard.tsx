'use client';

import * as React from 'react';
import {
    Box,
    Grid,
    Stack,
    Typography
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from 'tss-react/mui';

import { selectUser } from '@/redux/features/authSlice';
import { capitalize } from '@/utils/capitalize';
import { grey } from '@mui/material/colors';
import PendingPosts from './PendingPosts';
import { AppDispatch } from '@/redux/store';
import { getPendingPosts } from '@/redux/features/postsSlice';

const useStyles = makeStyles()((theme) => ({
    title: {
        fontWeight: 600,

        [theme.breakpoints.down('sm')]: {
            textAlign: 'center'
        }
    },

    card: {
        borderRadius: theme.shape.borderRadius,
        boxShadow: '0px 1px 2px 0px #1018280F, 0px 1px 3px 0px #1018281A',
        height: theme.spacing(20)
    }
}));


const Dashboard: React.FC<{}> = () => {
    const { classes } = useStyles();
    const dispatch: AppDispatch = useDispatch();

    const user = useSelector(selectUser);

    React.useEffect(() => {
        dispatch(getPendingPosts());
    }, [dispatch]);

    return (
        <Box component="main">
            <Typography variant="h5" className={classes.title}>Welcome back, {capitalize(user.name.split(' ')[0])}</Typography>
            <Typography variant="body1" color={grey[700]}>Track and manage the posts by users here</Typography>
            <Grid container direction="row" spacing={3}>
                <Grid item xs={12} lg={4}>
                    <Box component="div" className={classes.card}>
                        <Stack direction="column" sx={{ height: '100%', paddingLeft: 3 }} justifyContent="center" spacing={5}>
                            <Typography variant="subtitle1">Total Blog Posts</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 500 }}>22K</Typography>
                        </Stack>
                    </Box>
                </Grid>
                <Grid item xs={12} lg={4}>
                    <Box component="div" className={classes.card}>
                        <Stack direction="column" sx={{ height: '100%', paddingLeft: 3 }} justifyContent="center" spacing={5}>
                            <Typography variant="subtitle1">Total Visitors</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 500 }}>200</Typography>
                        </Stack>
                    </Box>
                </Grid>
                <Grid item xs={12} lg={4}>
                    <Box component="div" className={classes.card}>
                        <Stack direction="column" sx={{ height: '100%', paddingLeft: 3 }} justifyContent="center" spacing={5}>
                            <Typography variant="subtitle1">Registered Users</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 500 }}>200k</Typography>
                        </Stack>
                    </Box>
                </Grid>
            </Grid>
            <PendingPosts />
        </Box>
    );
};

export default Dashboard;