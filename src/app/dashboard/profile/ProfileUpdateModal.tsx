'use client';

import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Avatar,
    Box,
    Button, 
    CircularProgress, 
    IconButton, 
    Modal,
    Stack,
    TextField,
    Theme,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import _, { isEmpty } from 'lodash';

import { WHITE } from '@/app/theme';
import { ModalRef } from '@/utils/constants';
import { Close } from 'mdi-material-ui';

import { setToast } from '@/redux/features/appSlice';
import { AppDispatch } from '@/redux/store';
import { AuthError, clearError, deleteAvatar, selectAuthError, selectAuthMessage, selectIsAuthLoading, selectUser, setAuthMessage, updateUserProfile } from '@/redux/features/authSlice';

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
        width: theme.spacing(60),

        [theme.breakpoints.down('sm')]: {
            width: '85%'
        }
    },

    closeButton: {
        alignSelf: 'flex-end'
    },

    updateButton: {
        color: theme.palette.success.main
    },

    removeButton: {
        color: theme.palette.error.main
    }
}));

interface Props {
    ref: any;
}

const ProfileUpdateModal: React.FC<Props> = React.forwardRef<ModalRef, Props>((_props: Props, ref: any) => {
    const { classes } = useStyles();
    const dispatch: AppDispatch = useDispatch();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    const authError = useSelector(selectAuthError);
    const loading = useSelector(selectIsAuthLoading);
    const msg = useSelector(selectAuthMessage);
    const user = useSelector(selectUser);


    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState(user.name);
    const [imageSrc, setImageSrc] = React.useState<string | ArrayBuffer>('');
    const [image, setImage] = React.useState<File>('' as unknown as File);
    const [errors, setErrors] = React.useState<AuthError>({} as AuthError);

    const fileUploadRef = React.useRef<HTMLInputElement>(null);
    
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

    React.useEffect(() => {
        setImageSrc(user.avatar || '');
    }, [user.avatar]);

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
    }, [dispatch, handleClose, msg]);

    const handleSelectImage = (_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        fileUploadRef.current?.click();
    };

    const handleRemovePhoto = () => {
        if (user.avatar === imageSrc) {
            dispatch(deleteAvatar(user.avatarName!)); // deleteng photo from cloud storage
        } else {
            // deleting photo from state
            setImage('' as unknown as File);
            setImageSrc('');
        }
    };

    const handleSetImage = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { files } = e.target;
        setImage(files![0]);
        const reader = new FileReader();

        reader.onload = (() => {
            setImageSrc(reader.result!);
        });
        reader.readAsDataURL(files![0]);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors({} as AuthError);

        if (isEmpty(name)) {
                dispatch(setToast({
                type: 'error',
                message: 'Invalid Profile Data!'
            }));
            return setErrors({ ...errors, name: 'Your name is required!' });
        }

        const data = new FormData();
        data.append('name', name);
        if (image) {
            data.append('image', image);
        }

        dispatch(updateUserProfile({ data, _id: user._id! }));
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
                <Typography variant="h5" sx={{ fontWeight: 600 }}>Profile Information</Typography>   
                {loading && <Stack direction="row" alignItems="center" justifyContent="center" spacing={3}><CircularProgress /><Typography variant="body1">One Moment . . .</Typography></Stack>}
                <Typography variant="body1">Photo</Typography>
                <form onSubmit={handleSubmit}>
                    <Stack direction="column" spacing={5}>
                        <Stack direction={matches ? 'column' : 'row'} alignItems={matches ? 'center' : 'flex-start'} spacing={3}>
                            <Avatar 
                                src={imageSrc.toString()}
                                sx={{
                                    width: 180,
                                    height: 180
                                }}
                            />
                            <Stack direction="column">
                                <Stack direction="row" alignSelf={matches ? 'center' : 'flex-start'}>
                                    <Button
                                        variant="text"
                                        size="large"
                                        color="success"
                                        type="button"
                                        classes={{ root: classes.updateButton }}
                                        onClick={handleSelectImage}
                                        disabled={loading}
                                    >
                                        Update
                                    </Button>
                                        {imageSrc && <Button
                                            variant="text"
                                            size="large"
                                            color="error"
                                            type="button"
                                            classes={{ root: classes.removeButton }}
                                            onClick={handleRemovePhoto}
                                            disabled={loading}
                                        >
                                            Remove
                                        </Button>
                                    }
                                </Stack>
                                <Typography variant="body1">Recommended: Square JPG or PNG, at least 1000 pixels per side</Typography>
                            </Stack>
                        </Stack>
                        <input
                            ref={fileUploadRef}
                            accept=".png, .jpg, .webm"
                            style={{ display: 'none' }}
                            onChange={handleSetImage}
                            type="file"
                        />
                        <TextField 
                            type="text"
                            label="Full Name"
                            variant="outlined"
                            value={name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                            fullWidth
                            helperText={errors.name}
                            error={errors.name ? true : false}
                            disabled={loading}
                        />
                        <Stack direction="row" justifyContent="flex-end" spacing={3}>
                            <Button
                                variant="outlined"
                                size="large"
                                color="primary"
                                type="button"
                                onClick={handleClose}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                size="large"
                                color="primary"
                                type="submit"
                                disabled={loading}
                            >
                                Save
                            </Button>
                        </Stack>
                    </Stack>
                </form>
            </Box>
        </Modal>
    );
});

ProfileUpdateModal.displayName = 'ProfileUpdateModal';

export default ProfileUpdateModal;