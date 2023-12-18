'use client';

import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Avatar,
    Button, 
    Stack,
    TextField,
    Typography
} from '@mui/material';
import _, { isEmpty } from 'lodash';

import { setToast } from '@/redux/features/appSlice';
import { AppDispatch } from '@/redux/store';
import { addComment, clearError, CommentsError, selectCommentMessage, selectComments, selectCommentsErrors, selectIsCommentLoading, setCommentMessage } from '@/redux/features/commentsSlice';
import { ModalRef } from '@/utils/constants';
import ForgotPasswordModal from '@/components/common/ForgotPasswordModal';
import SignInModal from '@/components/common/SignInModal';
import SignUpModal from '@/components/common/SignUpModal';
import { selectIsUserAuthenticated } from '@/redux/features/authSlice';

interface Props {
    postId: string;
}

const CommentsForm: React.FC<Props> = ({ postId }) => {
    const dispatch: AppDispatch = useDispatch();

    const isAuthenticated = useSelector(selectIsUserAuthenticated);
    const comments = useSelector(selectComments);
    const commentsError = useSelector(selectCommentsErrors);
    const loading = useSelector(selectIsCommentLoading);
    const msg = useSelector(selectCommentMessage);

    const [text, setText] = React.useState('');
    const [errors, setErrors] = React.useState<CommentsError>({} as CommentsError);

    const forgotPasswordModalRef = React.useRef<ModalRef | null>(null);
    const signInModalRef = React.useRef<ModalRef | null>(null);
    const signUpModalRef = React.useRef<ModalRef | null>(null);

    const handleOpenForgotPasswordModal = ():void => {
        forgotPasswordModalRef.current?.openModal();
    };

    const handleOpenSignUpModal = ():void => {
        signUpModalRef.current?.openModal();
    };

    const handleOpenSignInModal = ():void => {
        signInModalRef.current?.openModal();
    };

    // Handle API error response
    React.useEffect(() => {
        if (!_.isEmpty(commentsError)) {
            setErrors(commentsError);
            dispatch(setToast({
                type: 'error',
                message: commentsError.msg!
            }));
        }
    }, [commentsError, dispatch]);

    React.useEffect(() => {
        if (!_.isEmpty(errors)) {
            dispatch(clearError());
        }
    }, [dispatch, errors]);

     React.useEffect(() => {
        if (msg) {
            dispatch(setCommentMessage(null));
            setText('');
        }
    }, [msg, dispatch]);

    const handleSubmit = ( event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors({} as CommentsError);


        if (isEmpty(text)) {
            return setErrors({ ...errors, text: 'Comment is required!' });
        }

        dispatch(addComment({ postId, text }));
    };
  
    return (
        <>
            <ForgotPasswordModal ref={forgotPasswordModalRef} handleOpenSignInModal={handleOpenSignInModal} />
            <SignInModal ref={signInModalRef} handleOpenForgotPasswordModal={handleOpenForgotPasswordModal} handleOpenSignUpModal={handleOpenSignUpModal} />
            <SignUpModal ref={signUpModalRef} handleOpenSignInModal={handleOpenSignInModal} />
            <form onSubmit={handleSubmit}>
                <Stack direction="column" spacing={2} alignItems="flex-end">
                    <Typography variant="h5" alignSelf="flex-start" sx={{ fontWeight: 500 }}>{comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}</Typography>
                    <Stack direction="row" spacing={1} alignSelf="stretch">
                        <Avatar />
                        <TextField 
                            type="text"
                            placeholder="Write a comment..."
                            variant="outlined"
                            value={text}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
                            fullWidth
                            multiline
                            minRows={3}
                            helperText={errors.text}
                            error={errors.text ? true : false}
                            disabled={loading}
                            onFocus={(event) => {
                                if (!isAuthenticated) {
                                    event.target.blur();
                                    handleOpenSignInModal();
                                    dispatch(setToast({
                                        type: 'info',
                                        message: 'Kindly log in to comment on post'
                                    }));
                                }
                            }}
                        />
                    </Stack>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        type="submit"
                        disabled={loading}
                    >
                        Submit
                    </Button>
                </Stack>
            </form>
        </>
    );
};


export default CommentsForm;