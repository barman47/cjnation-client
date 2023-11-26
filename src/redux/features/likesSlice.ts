import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

import { handleError } from '@/utils/handleError';
import { ApiErrorResponse, ApiResponse, Error } from '@/utils/constants';
import { RootState } from '../store';
import { Like } from '@/interfaces';

export type LikesError = Error & Like;

const URL = `${process.env.NEXT_PUBLIC_API}/likes`;

interface LikesState {
    isLoading: boolean;
    msg: string | null;
    error: LikesError;
};

const initialState: LikesState = {
    isLoading: false,
    msg: null,
    error: {} as LikesError
};

export const addLike = createAsyncThunk<ApiResponse, string, { rejectValue: ApiErrorResponse }>('likes/addLike', async (postId, { rejectWithValue }) => {
    try {
        const res = await axios.post<ApiResponse>(`${URL}/${postId}`);
        return res.data;
    } catch (err) {
        return handleError(err, rejectWithValue, 'Failed to add like to post');
    }
});

export const removeLike = createAsyncThunk<ApiResponse, string, { rejectValue: ApiErrorResponse }>('likes/removeLike', async (postId, { rejectWithValue }) => {
    try {
        const res = await axios.delete<ApiResponse>(`${URL}/${postId}`);
        return res.data;
    } catch (err) {
        return handleError(err, rejectWithValue, 'Failed to remove like from post');
    }
});

export const likes = createSlice({
    name: 'likes',
    initialState,
    reducers: {
        setLikesMessage: (state, action: PayloadAction<string | null>) => {
            state.msg = action.payload;
        },

        clearError: (state) => {
            state.error = {} as LikesError;
        }
    },

    extraReducers(builder) {
        builder
        .addCase(addLike.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(addLike.fulfilled, (state, action) => {
            state.isLoading = false;
            state.msg = action.payload.msg || 'Like saved successfully.';
        })
        .addCase(addLike.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload?.data;
        })

        .addCase(removeLike.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(removeLike.fulfilled, (state, action) => {
            state.isLoading = false;
            state.msg = action.payload.msg || 'Like removed successfully.';
        })
        .addCase(removeLike.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload?.data;
        })
    }
});

export const {
    setLikesMessage,
    clearError
} = likes.actions;

export const selectLikesErrors = (state: RootState) => state.likes.error;
export const selectIsLikesLoading = (state: RootState) => state.likes.isLoading;
export const selectLikesMessage = (state: RootState) => state.likes.msg;

export default likes.reducer;