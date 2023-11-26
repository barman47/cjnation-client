import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

import { handleError } from '@/utils/handleError';
import { ApiErrorResponse, ApiResponse, Error } from '@/utils/constants';
import { Post } from '@/interfaces';
import { RootState } from '../store';

export type PostError = Error & Post;

const URL = `${process.env.NEXT_PUBLIC_API}/posts`;

interface AuthState {
    isLoading: boolean;
    post: Post;
    posts: Post[];
    msg: string | null;
    error: PostError;
};

const initialState: AuthState = {
    isLoading: false,
    post: {} as Post,
    posts: [],
    msg: null,
    error: {} as PostError
};

export const createDraft = createAsyncThunk<ApiResponse, FormData, { rejectValue: ApiErrorResponse }>('posts/createDraft', async (draft, { rejectWithValue }) => {
    try {
        const res = await axios.post<ApiResponse>(`${URL}/drafts`, draft);
        return res.data;
    } catch (err) {
        return handleError(err, rejectWithValue, 'Failed to save post');
    }
});

export const posts = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        setPostMessage: (state, action: PayloadAction<string | null>) => {
            state.msg = action.payload
        },

        clearError: (state) => {
            state.error = {} as PostError;
        },
    },
    extraReducers(builder) {
        builder
        .addCase(createDraft.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(createDraft.fulfilled, (state, action) => {
            const { post } = action.payload.data;
            state.isLoading = false;
            state.post = post;
            state.msg = action.payload.msg || 'Your blog has been submitted and will reviewed and approved shortly by an admin';
        })
        .addCase(createDraft.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload?.data;
        })

        
    }
});

export const {
    clearError,
    setPostMessage,
} = posts.actions;

export const selectPostErrors = (state: RootState) => state.posts.error;
export const selectIsPostLoading = (state: RootState) => state.posts.isLoading;
export const selectPostMessage = (state: RootState) => state.posts.msg;
export const selectPost = (state: RootState) => state.posts.post;

export default posts.reducer;