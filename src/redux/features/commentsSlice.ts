import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

import { handleError } from '@/utils/handleError';
import { ApiErrorResponse, ApiResponse, Error } from '@/utils/constants';
import { RootState } from '../store';
import { Comment } from '@/interfaces';

export type CommentsError = Error & Comment;

const URL = `${process.env.NEXT_PUBLIC_API}/comments`;

export interface CommentData {
    text: string;
    postId: string;
}

interface CommentState {
    isLoading: boolean;
    msg: string | null;
    error: CommentsError;
};

const initialState: CommentState = {
    isLoading: false,
    msg: null,
    error: {} as CommentsError
};

export const addComment = createAsyncThunk<ApiResponse, CommentData, { rejectValue: ApiErrorResponse }>('comments/addComment', async ({ text, postId }, { rejectWithValue }) => {
    try {
        const res = await axios.post<ApiResponse>(`${URL}/${postId}`, { text });
        return res.data;
    } catch (err) {
        return handleError(err, rejectWithValue, 'Failed to add comment to post');
    }
});

export const comments = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        setCommentMessage: (state, action: PayloadAction<string | null>) => {
            state.msg = action.payload;
        },
        
        clearError: (state) => {
            state.error = {} as CommentsError;
        },
    },

    extraReducers(builder) {
        builder
        .addCase(addComment.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(addComment.fulfilled, (state, action) => {
            state.isLoading = false;
            state.msg = action.payload.msg || 'Comment added successfully';
        })
        .addCase(addComment.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload?.data;
        })
    }
});

export const {
    setCommentMessage,
    clearError
} = comments.actions;

export const selectCommentsErrors = (state: RootState) => state.comments.error;
export const selectIsCommentLoading = (state: RootState) => state.comments.isLoading;
export const selectCommentMessage = (state: RootState) => state.comments.msg;

export default comments.reducer;