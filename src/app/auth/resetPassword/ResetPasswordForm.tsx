'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Box,
    Button,
    CircularProgress,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Tooltip,
    Typography,
    Theme
} from '@mui/material';
import { EyeOffOutline, EyeOutline } from 'mdi-material-ui';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { makeStyles } from 'tss-react/mui';

import { AuthError, clearError, resetPassword, selectAuthError, selectAuthMessage, selectIsAuthLoading, setAuthMessage } from '@/redux/features/authSlice';
import { AppDispatch } from '@/redux/store';
import { validateResetPassword } from '@/utils/validation/auth/resetPassword';
import { setToast } from '@/redux/features/appSlice';

const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'        
    },

    form: {
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[15],
        marginTop: theme.spacing(10),
        width: '40%',
        padding: theme.spacing(3),

        [theme.breakpoints.down('md')]: {
            width: '80%'
        },

        [theme.breakpoints.down('sm')]: {
            width: '85%'
        }
    }
}));

const ResetPasswordForm: React.FC<{}> = () => {
    const { classes } = useStyles();
    const dispatch: AppDispatch = useDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();

    const authError = useSelector(selectAuthError);
    const loading = useSelector(selectIsAuthLoading);
    const msg = useSelector(selectAuthMessage);
    
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const [errors, setErrors] = React.useState<AuthError>({} as AuthError);

    const resetToken = searchParams.get('token');

    React.useEffect(() => {
        if (!resetToken) {
            router.replace('/');
        }
    }, [resetToken, router]);

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
            router.replace('/');
        }
    }, [dispatch, msg, router]);

    const toggleShowPassword = (): void => {
        setShowPassword((prev) => !prev);
    };

    const toggleShowConfirmPassword = (): void => {
        setShowConfirmPassword((prev) => !prev);
    };

    const handleSubmit = ( event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors({} as AuthError);

        const { errors, isValid } = validateResetPassword({ password, confirmPassword });

        if (!isValid) {
            // @ts-ignore
            setErrors({ ...errors });

            return dispatch(setToast({
                message: 'Invalid password data!',
                type: 'error'
            }));
        }

        dispatch(resetPassword({ password, confirmPassword, resetToken: resetToken! }));
    };

	return (
		<Box component="main" className={classes.root}>
            <form onSubmit={handleSubmit} className={classes.form}>
                <Stack direction="column" spacing={5}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>Reset Password</Typography>
                    <TextField 
                        type={showPassword ? 'text' : 'password'}
                        label="New Password"
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
                    <TextField 
                        type={showConfirmPassword ? 'text' : 'password'}
                        label="Confirm Password"
                        variant="outlined"
                        value={confirmPassword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                        fullWidth
                        helperText={errors.confirmPassword}
                        error={errors.confirmPassword ? true : false}
                        disabled={loading}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={toggleShowConfirmPassword}
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
                        {loading ? <><CircularProgress />&nbsp;&nbsp;One Moment . . .</> : 'Reset Password'}
                    </Button>
                </Stack>
            </form>
        </Box>
	);
}

export default ResetPasswordForm;
