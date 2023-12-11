'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
    Box,
    Button,
    Stack, 
    Typography 
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { CheckCircle, CloseCircle } from 'mdi-material-ui';
import { useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';

import { clearError, selectAuthError, selectAuthMessage, selectIsAuthLoading, selectIsUserAuthenticated, selectUser, verifyUserEmail } from '@/redux/features/authSlice';
import { AppDispatch } from '@/redux/store';
import Loading from '@/components/common/Loading';
import { setToast } from '@/redux/features/appSlice';

const useStyles = makeStyles()((theme) => ({
    root: {
        height: '50vw',
        width: '50vw',
        margin: 'auto',

        [theme.breakpoints.down('sm')]: {
            height: '80vh',
            width: '80vw',
        }
    },

    iconContainer: {
        backgroundColor: '#2AA85E1A',
        width: theme.spacing(15),
        height: theme.spacing(15),
        borderRadius: '50%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing(2)
    },

    icon: {
        color: '#2aa85e',
        height: '100%',
        width: '100%'
    },

    errorIconContainer: {
        backgroundColor: '#d32f2f4d',
        width: theme.spacing(15),
        height: theme.spacing(15),
        borderRadius: '50%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing(2)
    },

    errorIcon: {
        color: theme.palette.error.main,
        height: '100%',
        width: '100%'
    }
}));

const EmailVerification: React.FC<{}> = () => {
    const { classes } = useStyles();
    const dispatch: AppDispatch = useDispatch();
    const searchParams = useSearchParams();

    const user = useSelector(selectUser);
    const isAuthenticated = useSelector(selectIsUserAuthenticated);
    const loading = useSelector(selectIsAuthLoading);
    const authErrors = useSelector(selectAuthError);
    const msg = useSelector(selectAuthMessage);

    const [tokenInvalid, setTokenInvalid] = React.useState(false);

    React.useEffect(() => {
        if (!_.isEmpty(user) && isAuthenticated && user.emailVerified) {
            return;
        }
        
        const token = searchParams.get('token');

        if (!token) {
            setTokenInvalid(true);
        } else {
            dispatch(verifyUserEmail(token));
        }

        // eslint-disable-next-line
    }, []);

    React.useEffect(() => {
        if (!_.isEmpty(authErrors)) {
            setTokenInvalid(true);
            dispatch(setToast({
                type: 'error',
                message: authErrors.msg || 'Email verification failed'
            }));
            dispatch(clearError());
        }
    }, [authErrors, dispatch]);

    React.useEffect(() => {
        if (msg) {
            dispatch(setToast({
                type: 'success',
                message: msg
            }));
        }
    }, [msg, dispatch]);


    if (loading) {
        return (
            <Loading />
        );
    }

    return (
        <Stack 
            direction="column" 
            className={classes.root} 
            alignItems="center" 
            justifyContent="center"
            spacing={2}
        >
            {tokenInvalid ?
                <>
                    <Box component="div" className={classes.errorIconContainer}>
                        <CloseCircle className={classes.errorIcon} />
                    </Box>
                    <Typography variant="h5">Failure</Typography>
                    <Typography variant="body1">Email verification token has expired.</Typography>
                </>
                :
                <>
                    <Box component="div" className={classes.iconContainer}>
                        <CheckCircle className={classes.icon} />
                    </Box>
                    <Typography variant="h5">Success</Typography>
                    <Typography variant="body1">Thanks for verifying your email. Now let&#39;s take you to your homepage...</Typography>
                </>
            }
            <Button
                variant="contained"
                color="secondary"
                size="large"
                LinkComponent={Link}
                href="/"
            >
                Go Home
            </Button>
        </Stack>
    );
};

export default EmailVerification;