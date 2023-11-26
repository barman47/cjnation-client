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

export const createPost = createAsyncThunk<ApiResponse, FormData, { rejectValue: ApiErrorResponse }>('posts/createPost', async (post, { rejectWithValue }) => {
    try {
        const res = await axios.post<ApiResponse>(URL, post);
        return res.data;
    } catch (err) {
        return handleError(err, rejectWithValue, 'Failed to save post');
    }
});

export const getPostsByCategory = createAsyncThunk<ApiResponse, string, { rejectValue: ApiErrorResponse }>('posts/getPostsByCategory', async (categoryId, { rejectWithValue }) => {
    try {
        const res = await axios.get<ApiResponse>(`${URL}/categories/category/${categoryId}`);
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
            state.msg = action.payload;
        },

        setPosts: (state, action: PayloadAction<Post[]>) => {
            state.posts = action.payload;
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
            state.isLoading = false;
            state.post = action.payload.data;
            state.msg = action.payload.msg || 'Your blog has been saved succcessfully. You can always come back and continue writing.';
        })
        .addCase(createDraft.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload?.data;
        })

        .addCase(createPost.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(createPost.fulfilled, (state, action) => {
            state.isLoading = false;
            state.post = action.payload.data;
            state.msg = action.payload.msg || 'Your blog has been submitted and will reviewed and approved shortly by an admin';
        })
        .addCase(createPost.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload?.data;
        })

        .addCase(getPostsByCategory.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getPostsByCategory.fulfilled, (state, action) => {
            state.isLoading = false;
            state.posts = [...action.payload.data];
        })
        .addCase(getPostsByCategory.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload?.data;
        })

        
    }
});

export const {
    clearError,
    setPosts,
    setPostMessage,
} = posts.actions;

export const selectPostErrors = (state: RootState) => state.posts.error;
export const selectIsPostLoading = (state: RootState) => state.posts.isLoading;
export const selectPostMessage = (state: RootState) => state.posts.msg;
export const selectPost = (state: RootState) => state.posts.post;
export const selectPosts = (state: RootState) => state.posts.posts;

export default posts.reducer;