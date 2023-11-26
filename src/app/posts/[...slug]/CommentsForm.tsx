'use client';

import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Avatar,
    Button, 
    CircularProgress, 
    Stack,
    TextField,
    Theme,
    Typography
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import _ from 'lodash';

import { setToast } from '@/redux/features/appSlice';
import { AppDispatch } from '@/redux/store';
import { LoginData } from '@/utils/validation/auth';
import { clearError, selectAuthError, selectAuthMessage, selectIsAuthLoading } from '@/redux/features/authSlice';

const useStyles = makeStyles()((theme: Theme) => ({
    root: {

    }
}));

const CommentsForm: React.FC<{}> = () => {
    const { classes } = useStyles();
    const dispatch: AppDispatch = useDispatch();

    const authError = useSelector(selectAuthError);
    const loading = useSelector(selectIsAuthLoading);
    const msg = useSelector(selectAuthMessage);

    const [comment, setComment] = React.useState('');
    const [errors, setErrors] = React.useState<LoginData>({} as LoginData);

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

    // React.useEffect(() => {
    //     if (msg) {
    //         dispatch(setToast({
    //             type: 'success',
    //             message: msg,
    //             autoHideDuration: 6000
    //         }));
    //         dispatch(setAuthMessage(null));
    //         handleClose();
    //     }
    // }, [dispatch, handleClose, msg]);

    const handleSubmit = ( event: React.FormEvent<HTMLFormElement>) => {
        // event.preventDefault();
        // setErrors({} as LoginData);

        // const data: LoginData = {
        //     email,
        //     password
        // };

        // const { errors, isValid } = validateLoginUser(data);

        // if (!isValid) {
        //     dispatch(setToast({
        //         type: 'error',
        //         message: 'Invalid Login Data!'
        //     }));
        //     return setErrors(errors);
        // }

        // dispatch(login(data));
    };
  
    return (
        <form onSubmit={handleSubmit}>
            <Stack direction="column" spacing={5} alignItems="flex-end">
                <Typography variant="h5" alignSelf="flex-start" sx={{ fontWeight: 500 }}>32 Comments</Typography>
                <Stack direction="row" spacing={1} alignSelf="stretch">
                    <Avatar />
                    <TextField 
                        type="text"
                        placeholder="Write a comment..."
                        variant="outlined"
                        value={comment}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setComment(e.target.value)}
                        fullWidth
                        multiline
                        minRows={3}
                        // helperText={errors.comment || 'Password should be at least 8 characters long'}
                        // error={errors.password ? true : false}
                        // disabled={loading}
                    />
                </Stack>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? <><CircularProgress />&nbsp;&nbsp;Posting Comment . . .</> : 'Submit'}
                </Button>
            </Stack>
        </form>
    );
};


export default CommentsForm;