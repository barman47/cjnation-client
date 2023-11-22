'use client';

import * as React from 'react';
import { useDispatch } from 'react-redux';
import {
    Box,
    Button, 
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
import { OFF_BLACK, WHITE } from '@/app/theme';
import { ModalRef } from '@/utils/constants';
import { Close, EyeOffOutline, EyeOutline } from 'mdi-material-ui';
import { GoogleLogin } from '@react-oauth/google';
import { setToast } from '@/redux/features/appSlice';
import { AppDispatch } from '@/redux/store';

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
    handleOpenSignUpModal: () => void;
}

const SignInModal: React.FC<Props> = React.forwardRef<ModalRef, Props>(({ handleOpenSignUpModal }: Props, ref: any) => {
    const { classes } = useStyles();
    const dispatch: AppDispatch = useDispatch();

    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    // const [errors, setErrors] = React.useState<LoginData>({} as LoginData);
    
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    React.useImperativeHandle(ref, () => ({
        openModal: () => {
            handleOpen();
        },

        closeModal: () => {
            handleClose();
        }
    }));

    const toggleShowPassword = (): void => {
        setShowPassword(!showPassword);
    };

    const showSignUpModal = () => {
        handleOpenSignUpModal();
        handleClose();
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
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>Log In</Typography>
                    <GoogleLogin
                        text="signin_with"
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
                    <form>
                        <Stack direction="column" spacing={5}>
                            <TextField 
                                type="email"
                                placeholder="Email"
                                variant="outlined"
                                value={email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                fullWidth
                                // helperText={errors.email}
                                // error={errors.email ? true : false}
                            />
                            <TextField 
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                variant="outlined"
                                value={password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                fullWidth
                                // helperText={errors.password || 'Password should be at least 8 characters long'}
                                // error={errors.password ? true : false}
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
                            >
                                Log In
                            </Button>
                            <Typography variant="body2" component="small" className={classes.text}>
                                Don&#39;t have an account?
                                <Button
                                    variant="text"
                                    color="primary"
                                    size="small"
                                    type="button"
                                    onClick={showSignUpModal}
                                >
                                    Sign Up
                                </Button>
                            </Typography>
                        </Stack>
                    </form>
                </Stack>
            </Box>
        </Modal>
    );
});

SignInModal.displayName = 'SignInModal';

export default SignInModal;