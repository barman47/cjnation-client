import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

import { handleError } from '@/utils/handleError';
import { ApiErrorResponse, ApiResponse, Error } from '@/utils/constants';
import { Music } from '@/interfaces';
import { RootState } from '../store';

export type MusicError = Error & Music;

const URL = `${process.env.NEXT_PUBLIC_API}/music`;

interface MusicState {
    isLoading: boolean;
    musics: Music[];
    msg: string | null;
    error: MusicError;
};

const initialState: MusicState = {
    isLoading: false,
    musics: [],
    msg: null,
    error: {} as MusicError
};

export const addMusic = createAsyncThunk<ApiResponse, FormData, { rejectValue: ApiErrorResponse }>('music/addMusic', async (data, { rejectWithValue }) => {
    try {
        const res = await axios.post<ApiResponse>(`${URL}`, data);
        return res.data;
    } catch (err) {
        return handleError(err, rejectWithValue, 'Failed to add music');
    }
});

export const music = createSlice({
    name: 'music',
    initialState,
    reducers: {
        setMusics: (state, action: PayloadAction<Music[]>) => {
            state.musics = action.payload;
        },

        setMusicMessage: (state, action: PayloadAction<string | null>) => {
            state.msg = action.payload;
        },

        clearMusicErrors: (state) => {
            state.error = {} as MusicError;
        },
    },
    extraReducers(builder) {
        builder
        .addCase(addMusic.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(addMusic.fulfilled, (state, action) => {
            state.isLoading = false;
            state.msg = action.payload.msg || 'Music added successfully'
        })
        .addCase(addMusic.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload?.data;
        })
        
    }
});

export const {
    clearMusicErrors,
    setMusicMessage,
    setMusics
} = music.actions;

export const selectMusicErrors = (state: RootState) => state.music.error;
export const selectIsMusicLoading = (state: RootState) => state.music.isLoading;
export const selectMusicMessage = (state: RootState) => state.music.msg;
export const selectMusics = (state: RootState) => state.music.musics;

export default music.reducer;