'use client';

import * as React from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Button,
    IconButton, 
    Modal,
    Stack,
    Theme,
    Typography
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import _ from 'lodash';

import { OFF_BLACK, WHITE } from '@/app/theme';
import { ModalRef } from '@/utils/constants';
import { Close, EmailOutline } from 'mdi-material-ui';

import { setToast } from '@/redux/features/appSlice';
import { AppDispatch } from '@/redux/store';
import { LoginData } from '@/utils/validation/auth';
import { clearError, getEmailVerificationLink, selectAuthError, selectAuthMessage, selectIsAuthLoading, selectUser, setAuthMessage } from '@/redux/features/authSlice';

import mailImage from '../../../public/assets/mail-sent.svg';

const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        backgroundColor: WHITE,
        borderRadius: '5px',
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        top: '50%',
        left: '50%',
        padding: theme.spacing(0, 2, 2, 2),
        transform: 'translate(-50%, -50%)',
        width: theme.spacing(55),

        [theme.breakpoints.down('sm')]: {
            width: '85%'
        }
    },

    closeButton: {
        alignSelf: 'flex-end'
    },

    subtitle: {
        color: OFF_BLACK
    }
}));

interface Props {
    ref: any;
}

const AccountVerificationModal: React.FC<Props> = React.forwardRef<ModalRef, Props>((_props: Props, ref: any) => {
    const { classes } = useStyles();
    const dispatch: AppDispatch = useDispatch();

    const user = useSelector(selectUser);
    const authError = useSelector(selectAuthError);
    const loading = useSelector(selectIsAuthLoading);
    const msg = useSelector(selectAuthMessage);

    const [open, setOpen] = React.useState(false);
    const [errors, setErrors] = React.useState<LoginData>({} as LoginData);
    
    const handleOpen = () => setOpen(true);
    const handleClose = React.useCallback(() => {
        if(!loading) {
            setOpen(false)
        }
    }, [loading]);

    React.useImperativeHandle(ref, () => ({
        openModal: () => {
            handleOpen();
        },

        closeModal: () => {
            handleClose();
        }
    }));

    // Handle API error response
    React.useEffect(() => {
        if (!_.isEmpty(authError)) {
            setErrors(authError);
            dispatch(setToast({
                type: 'error',
                message: authError.msg!
            }));
        }
    }, [authError, dispatch]);

    React.useEffect(() => {
        if (!_.isEmpty(errors)) {
            dispatch(clearError());
        }
    }, [dispatch, errors]);

    React.useEffect(() => {
        if (msg) {
            dispatch(setToast({
                type: 'success',
                message: msg,
                autoHideDuration: 6000
            }));
            dispatch(setAuthMessage(null));
        }
    }, [dispatch, msg]);
  
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            disableEscapeKeyDown
        >
            <Box component="section" className={classes.root}>
                <IconButton
                    onClick={handleClose}
                    className={classes.closeButton}
                >
                    <Close />
                </IconButton>
                <Stack direction="column" spacing={2}>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>Check your Email</Typography>
                    <Typography variant="body1">We sent a link to {user.email} to verify your email</Typography>
                    <Box alignSelf="center">
                        <Image 
                            src={mailImage}
                            width={200}
                            height={200}
                            alt="mail image"
                        />
                    </Box>
                    <Typography variant="body1">If you don&#39;t see it within a few minutes, be sure to check your spam folders.</Typography>
                    <Button 
                        LinkComponent="a"
                        href="mailto:"
                        variant="outlined"
                        color="primary"
                        size="large"
                        startIcon={<EmailOutline />}
                        disabled={loading}
                    >
                        Open Email
                    </Button>
                    <Stack direction="row" alignItems="center">
                        <Typography variant="body1">Can&#39;t find the email?</Typography>
                        <Button
                            color="primary"
                            variant="text"
                            size="large"
                            onClick={() => dispatch(getEmailVerificationLink())}
                            disabled={loading}
                        >
                            {loading ? 'Sendind Link . . .' : 'Resend'}
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </Modal>
    );
});

AccountVerificationModal.displayName = 'AccountVerificationModal';

export default AccountVerificationModal;