'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
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
import { addComment, clearError, CommentsError, selectCommentMessage, selectCommentsErrors, selectIsCommentLoading, setCommentMessage } from '@/redux/features/commentsSlice';

interface Props {
    postId: string;
    numberOfComments: number;
}

const CommentsForm: React.FC<Props> = ({ postId, numberOfComments }) => {
    const dispatch: AppDispatch = useDispatch();
    const router = useRouter();

    const commentsError = useSelector(selectCommentsErrors);
    const loading = useSelector(selectIsCommentLoading);
    const msg = useSelector(selectCommentMessage);

    const [text, setText] = React.useState('');
    const [errors, setErrors] = React.useState<CommentsError>({} as CommentsError);

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
            router.refresh()
            dispatch(setCommentMessage(null));
            setText('');
        }
    }, [msg, dispatch, router]);

    const handleSubmit = ( event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors({} as CommentsError);


        if (isEmpty(text)) {
            return setErrors({ ...errors, text: 'Comment is required!' });
        }

        dispatch(addComment({ postId, text }));
    };
  
    return (
        <form onSubmit={handleSubmit}>
            <Stack direction="column" spacing={2} alignItems="flex-end">
                <Typography variant="h5" alignSelf="flex-start" sx={{ fontWeight: 500 }}>{numberOfComments} {numberOfComments === 1 ? 'Comment' : 'Comments'}</Typography>
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
    );
};


export default CommentsForm;