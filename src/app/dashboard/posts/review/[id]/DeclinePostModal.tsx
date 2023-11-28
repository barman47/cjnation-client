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

import { OFF_BLACK, WHITE } from '@/app/theme';
import { ModalRef } from '@/utils/constants';
import { Close } from 'mdi-material-ui';

import { setToast } from '@/redux/features/appSlice';
import { AppDispatch } from '@/redux/store';
import { PostError, clearError, rejectPost, selectIsPostLoading, selectPost, selectPostErrors } from '@/redux/features/postsSlice';


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

const DeclinePostModal: React.FC<Props> = React.forwardRef<ModalRef, Props>((_props: Props, ref: any) => {
    const { classes } = useStyles();
    const dispatch: AppDispatch = useDispatch();

    const postErrors = useSelector(selectPostErrors);
    const loading = useSelector(selectIsPostLoading);
    const postId = useSelector(selectPost)._id!;

    const [rejectionReason, setRejectionReason] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [errors, setErrors] = React.useState<PostError>({} as PostError);
    
    const handleOpen = () => setOpen(true);
    const handleClose = React.useCallback(() => {
        if(!loading) {
            setErrors({} as PostError);
            setRejectionReason('');
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
        if (!_.isEmpty(postErrors)) {
            setErrors(postErrors);
        }
    }, [postErrors, dispatch]);

    React.useEffect(() => {
        if (!_.isEmpty(errors)) {
            dispatch(clearError());
        }
    }, [dispatch, errors]);

    const handleSubmit = ( event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors({} as PostError);

        if (_.isEmpty(rejectionReason)) {
            dispatch(setToast({
                type: 'error',
                message: 'Invalid rejection Data!'
            }));
            return setErrors({ ...errors, rejectionReason: 'Rejection reason is required' });
        }

        dispatch(rejectPost({ postId, rejectionReason }));
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
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>Provide Reason</Typography>
                    <Typography variant="body1">Update the writer about why the article was not approved for possible adjustment</Typography>
                    <form onSubmit={handleSubmit}>
                        <Stack direction="column" spacing={5}>
                            <TextField 
                                type="text"
                                placeholder="Write reason"
                                variant="outlined"
                                value={rejectionReason}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRejectionReason(e.target.value)}
                                fullWidth
                                multiline
                                minRows={5}
                                helperText={errors.rejectionReason}
                                error={errors.rejectionReason ? true : false}
                                disabled={loading}
                            />
                            <Button
                                variant="contained"
                                color="secondary"
                                size="large"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? <><CircularProgress />&nbsp;&nbsp;One Moment . . .</> : 'Send'}
                            </Button>
                        </Stack>
                    </form>
                </Stack>
            </Box>
        </Modal>
    );
});

DeclinePostModal.displayName = 'DeclinePostModal';

export default DeclinePostModal;