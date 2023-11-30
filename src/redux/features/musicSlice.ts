import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { CancelTokenSource } from 'axios';

import { handleError } from '@/utils/handleError';
import { ApiErrorResponse, ApiResponse, Error } from '@/utils/constants';
import { Music } from '@/interfaces';
import { RootState } from '../store';

export type MusicError = Error & Music;

let cancelSource: CancelTokenSource | null = null;

const URL = `${process.env.NEXT_PUBLIC_API}/music`;

interface MusicState {
    isLoading: boolean;
    music: Music;
    musics: Music[];
    msg: string | null;
    error: MusicError;
};

const initialState: MusicState = {
    isLoading: false,
    music: {} as Music,
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

export const getMusics = createAsyncThunk<ApiResponse, void, { rejectValue: ApiErrorResponse }>('music/getMusics', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get<ApiResponse>(`${URL}`);
        return res.data;
    } catch (err) {
        return handleError(err, rejectWithValue, 'Failed to get music');
    }
});

export const deleteMusic = createAsyncThunk<ApiResponse, string, { rejectValue: ApiErrorResponse }>('music/deleteMusic', async (musicId, { rejectWithValue }) => {
    try {
        const res = await axios.delete<ApiResponse>(`${URL}/${musicId}`);
        return res.data;
    } catch (err) {
        return handleError(err, rejectWithValue, 'Failed to delete music');
    }
});

// export const searchMusic = createAsyncThunk<ApiResponse, string, { rejectValue: ApiErrorResponse }>('music/searchMusic', async (searchText, { rejectWithValue }) => {
//     try {
//         const res = await axios.get<ApiResponse>(`${URL}/search?text=${searchText}`);
//         return res.data;
//     } catch (err) {
//         return handleError(err, rejectWithValue, 'Failed to search music');
//     }
// });

export const searchMusic = createAsyncThunk<ApiResponse, string, { rejectValue: ApiErrorResponse }>('music/searchMusic', async (searchText, { rejectWithValue }) => {
    // Cancel the previous request if it exists
    if (cancelSource) {
        cancelSource.cancel('New request initiated');
    }
  
    // Create a new CancelTokenSource for the current request
    cancelSource = axios.CancelToken.source();
  
    try {
        const res = await axios.get<ApiResponse>(`${URL}/search?text=${searchText}`, { cancelToken: cancelSource.token });
        return res.data;
    } catch (err) {
        if (axios.isCancel(err)) {
          console.log('Request canceled:', err.message);
        } else {
          return handleError(err, rejectWithValue, 'Failed to search music');
        }
    }
});

export const music = createSlice({
    name: 'music',
    initialState,
    reducers: {
        setMusic: (state, action: PayloadAction<Music>) => {
            state.music = action.payload;
        },

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
            state.musics = [action.payload.data, ...state.musics]
            state.msg = action.payload.msg || 'Music added successfully'
        })
        .addCase(addMusic.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload?.data;
        })

        .addCase(getMusics.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getMusics.fulfilled, (state, action) => {
            state.isLoading = false;
            state.musics = action.payload.data;
        })
        .addCase(getMusics.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload?.data;
        })

        .addCase(deleteMusic.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(deleteMusic.fulfilled, (state, action) => {
            const deletedMusic:Music = action.payload.data;
            state.isLoading = false;
            state.msg = action.payload.msg || 'Music deleted successfully'
            state.musics = state.musics.filter((music: Music) => music._id !== deletedMusic._id);
        })
        .addCase(deleteMusic.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload?.data;
        })

        .addCase(searchMusic.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(searchMusic.fulfilled, (state, action) => {
            state.isLoading = false;
            state.musics = action.payload.data;
        })
        .addCase(searchMusic.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload?.data;
        })
    }
});

export const {
    clearMusicErrors,
    setMusicMessage,
    setMusic,
    setMusics
} = music.actions;

export const selectMusicErrors = (state: RootState) => state.music.error;
export const selectIsMusicLoading = (state: RootState) => state.music.isLoading;
export const selectMusicMessage = (state: RootState) => state.music.msg;
export const selectMusics = (state: RootState) => state.music.musics;
export const selectMusic = (state: RootState) => state.music.music;

export default music.reducer;