'use client';

import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Button, 
    CircularProgress, 
    Divider, 
    IconButton, 
    InputAdornment, 
    Modal,
    Stack,
    TextField,
    Theme,
    Tooltip,
    Typography
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { ModalRef } from '@/utils/constants';
import { Close, EyeOffOutline, EyeOutline } from 'mdi-material-ui';
import { GoogleLogin } from '@react-oauth/google';
import _ from 'lodash';

import { OFF_BLACK, WHITE } from '@/app/theme';
import { setToast } from '@/redux/features/appSlice';
import { AppDispatch } from '@/redux/store';
import { UserRegistrationData, validateRegisterUser } from '@/utils/validation/auth';
import { clearError, registerUser, selectAuthError, selectAuthMessage, selectIsAuthLoading, setAuthMessage } from '@/redux/features/authSlice';

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
        // width: theme.spacing(65),
    },

    closeButton: {
        alignSelf: 'flex-end'
    },

    subtitle: {
        color: OFF_BLACK
    },

    text: {
        
    }
}));

interface Props {
    ref: any;
    handleOpenSignInModal: () => void;
}

const SignUpModal: React.FC<Props> = React.forwardRef<ModalRef, Props>(({ handleOpenSignInModal }: Props, ref: any) => {
    const { classes } = useStyles();
    const dispatch: AppDispatch = useDispatch();

    const authError = useSelector(selectAuthError);
    const loading = useSelector(selectIsAuthLoading);
    const msg = useSelector(selectAuthMessage);

    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [errors, setErrors] = React.useState<UserRegistrationData>({} as UserRegistrationData);
    
    const handleOpen = () => setOpen(true);
    const handleClose = React.useCallback(() => {
        if (!loading) {
            setOpen(false);
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
            setEmail('');
            setName('');
            setPassword('');
            dispatch(setToast({
                type: 'success',
                message: msg
            }));
            dispatch(setAuthMessage(null));
            handleClose();
        }
    }, [dispatch, handleClose, msg]);

    const toggleShowPassword = (): void => {
        setShowPassword(!showPassword);
    };

    const showSignInModal = () => {
        handleOpenSignInModal();
        handleClose();
    };

    const handleSubmit = ( event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors({} as UserRegistrationData);

        const data: UserRegistrationData = {
            name,
            email,
            password
        };

        const { errors, isValid } = validateRegisterUser(data);

        if (!isValid) {
            dispatch(setToast({
                type: 'error',
                message: 'Invalid Registration Data!'
            }));
            return setErrors(errors);
        }

        dispatch(registerUser(data));
    };
  
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
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>Sign Up</Typography>
                    <Typography variant="body1" className={classes.subtitle}>
                        By continuing, you are setting up an account and agree to our Terms of Service and Privacy Policy
                    </Typography>
                    <GoogleLogin
                        text="continue_with"
                        onSuccess={response => {
                            // dispatch(verifySocialLogin({ accessToken: response.credential!, provider: Provider.GOOGLE }));
                        }}
                        onError={() => {
                            dispatch(setToast({
                                type: 'error',
                                message: 'Google Authentication Failed'
                            }));
                        }}
                        cancel_on_tap_outside={true}
                        ux_mode="popup"
                        logo_alignment="left"
                        size="large"
                        width="1000"

                    />
                    <Divider>OR</Divider>
                    <form onSubmit={handleSubmit}>
                        <Stack direction="column" spacing={5}>
                            <TextField 
                                type="text"
                                label="Name"
                                variant="outlined"
                                value={name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                                fullWidth
                                helperText={errors.name || 'e.g. John Doe'}
                                error={errors.name ? true : false}
                                disabled={loading}
                            />
                            <TextField 
                                type="email"
                                label="Email"
                                variant="outlined"
                                value={email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                fullWidth
                                helperText={errors.email || 'e.g. john@doe.com'}
                                error={errors.email ? true : false}
                                disabled={loading}
                            />
                            <TextField 
                                type={showPassword ? 'text' : 'password'}
                                label="Password"
                                variant="outlined"
                                value={password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                fullWidth
                                helperText={errors.password || 'Password should be at least 8 characters long'}
                                error={errors.password ? true : false}
                                disabled={loading}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={toggleShowPassword}
                                            >
                                                {showPassword ? 
                                                    <Tooltip title="Hide Password" placement="bottom" arrow>
                                                        <EyeOutline />
                                                    </Tooltip>
                                                        : 
                                                        <Tooltip title="Show Password" placement="bottom" arrow>
                                                        <EyeOffOutline />
                                                    </Tooltip>
                                                    }
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? <><CircularProgress />&nbsp;&nbsp;One Moment . . .</> : 'Sign Up'}
                            </Button>
                            <Typography variant="body2" component="small" className={classes.text}>
                                Already have an account?
                                <Button
                                    variant="text"
                                    color="primary"
                                    size="small"
                                    type="button"
                                    onClick={showSignInModal}
                                    disabled={loading}
                                >
                                    Sign In
                                </Button>
                            </Typography>
                        </Stack>
                    </form>
                </Stack>
            </Box>
        </Modal>
    );
});

SignUpModal.displayName = 'SignUpModal';

export default SignUpModal;