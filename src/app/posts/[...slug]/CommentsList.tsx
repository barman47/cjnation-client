'use client';

import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Stack } from '@mui/material';

import Comment from './Comment';
import { Comment as CommentData } from '@/interfaces';
import { selectComments, setComments } from '@/redux/features/commentsSlice';
import { AppDispatch } from '@/redux/store';

interface Props {
    comments: CommentData[];
}

const CommentsList: React.FC<Props> = ({ comments }) => {
    const dispatch: AppDispatch = useDispatch();

    const postComments = useSelector(selectComments);

    React.useEffect(() => {
        dispatch(setComments(comments));
    }, [comments, dispatch]);

    return (
        <Stack direction="column" spacing={5}>
            {postComments.map((comment: CommentData) => (
                <Comment key={comment._id} comment={comment} />
            ))}
        </Stack>
    );
};


export default CommentsList;