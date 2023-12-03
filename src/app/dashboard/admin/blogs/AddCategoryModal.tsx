'use client';

import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Button, 
    CircularProgress,
    IconButton, 
    Modal,
    Stack,
    TextField,
    Theme,
    Typography
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import _ from 'lodash';

import { WHITE } from '@/app/theme';
import { ModalRef } from '@/utils/constants';
import { Close } from 'mdi-material-ui';

import { setToast } from '@/redux/features/appSlice';
import { AppDispatch } from '@/redux/store';
import { LoginData } from '@/utils/validation/auth';
import { clearError, selectAuthError, selectAuthMessage, selectIsAuthLoading, setAuthMessage } from '@/redux/features/authSlice';

const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        backgroundColor: WHITE,
        borderRadius: '5px',
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(2),
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
    }
}));

interface Props {
    ref: any;
}

const AddCategoryModal: React.FC<Props> = React.forwardRef<ModalRef, Props>((_props: Props, ref: any) => {
    const { classes } = useStyles();
    const dispatch: AppDispatch = useDispatch();

    const authError = useSelector(selectAuthError);
    const loading = useSelector(selectIsAuthLoading);
    const msg = useSelector(selectAuthMessage);

    const [name, setName] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [errors, setErrors] = React.useState<LoginData>({} as LoginData);
    
    const handleOpen = () => setOpen(true);

    const handleClose = React.useCallback(() => {
        if(!loading) {
            resetForm();
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
            resetForm();
            dispatch(setToast({
                type: 'success',
                message: msg,
                autoHideDuration: 6000
            }));
            dispatch(setAuthMessage(null));
            handleClose();
        }
    }, [dispatch, handleClose, msg]);

    const resetForm = () => {
        setName('');
        setErrors({} as LoginData);
    };

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
                <Typography variant="h5" sx={{ fontWeight: 600 }}>Add Blog Category</Typography>
                <form onSubmit={handleSubmit}>
                    <Stack direction="column" spacing={5}>
                        <TextField 
                            type="text"
                            label="Category Name"
                            variant="outlined"
                            value={name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                            fullWidth
                            // helperText={errors.name}
                            // error={errors.name ? true : false}
                            // disabled={loading}
                        />
                        <Button
                            variant="contained"
                            color="secondary"
                            size="large"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? <><CircularProgress />&nbsp;&nbsp;One Moment . . .</> : 'Add'}
                        </Button>
                    </Stack>
                </form>
            </Box>
        </Modal>
    );
});

AddCategoryModal.displayName = 'AddCategoryModal';

export default AddCategoryModal;