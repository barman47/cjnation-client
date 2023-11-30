import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

import { handleError } from '@/utils/handleError';
import { ApiErrorResponse, ApiResponse, Error } from '@/utils/constants';
import { Movie } from '@/interfaces';
import { RootState } from '../store';

export type MovieError = Error & Movie;

const URL = `${process.env.NEXT_PUBLIC_API}/movies`;

interface MovieState {
    isLoading: boolean;
    movies: Movie[];
    msg: string | null;
    error: MovieError;
};

const initialState: MovieState = {
    isLoading: false,
    movies: [],
    msg: null,
    error: {} as MovieError
};

export const addMovie = createAsyncThunk<ApiResponse, FormData, { rejectValue: ApiErrorResponse }>('movies/addMovie', async (data, { rejectWithValue }) => {
    try {
        const res = await axios.post<ApiResponse>(`${URL}`, data);
        return res.data;
    } catch (err) {
        return handleError(err, rejectWithValue, 'Failed to add movie');
    }
});

export const getMovies = createAsyncThunk<ApiResponse, void, { rejectValue: ApiErrorResponse }>('music/getMovies', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get<ApiResponse>(`${URL}`);
        return res.data;
    } catch (err) {
        return handleError(err, rejectWithValue, 'Failed to get movies');
    }
});

export const deleteMovie = createAsyncThunk<ApiResponse, string, { rejectValue: ApiErrorResponse }>('music/deleteMovie', async (movieId, { rejectWithValue }) => {
    try {
        const res = await axios.delete<ApiResponse>(`${URL}/${movieId}`);
        return res.data;
    } catch (err) {
        return handleError(err, rejectWithValue, 'Failed to get movies');
    }
});

export const movies = createSlice({
    name: 'movies',
    initialState,
    reducers: {
        setMovies: (state, action: PayloadAction<Movie[]>) => {
            state.movies = action.payload;
        },

        setMoviesMessage: (state, action: PayloadAction<string | null>) => {
            state.msg = action.payload;
        },

        clearMovieErrors: (state) => {
            state.error = {} as MovieError;
        },
    },
    extraReducers(builder) {
        builder
        .addCase(addMovie.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(addMovie.fulfilled, (state, action) => {
            state.isLoading = false;
            state.msg = action.payload.msg || 'Movie added successfully';
            state.movies = [action.payload.data, ...state.movies]
        })
        .addCase(addMovie.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload?.data;
        })

        .addCase(getMovies.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getMovies.fulfilled, (state, action) => {
            state.isLoading = false;
            state.movies = action.payload.data;
        })
        .addCase(getMovies.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload?.data;
        })

        .addCase(deleteMovie.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(deleteMovie.fulfilled, (state, action) => {
            const deletedMovie:Movie = action.payload.data;
            state.isLoading = false;
            state.msg = action.payload.msg || 'Movie deleted successfully'
            state.movies = state.movies.filter((movie: Movie) => movie._id !== deletedMovie._id);
        })
        .addCase(deleteMovie.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload?.data;
        })
        
    }
});

export const {
    clearMovieErrors,
    setMoviesMessage,
    setMovies
} = movies.actions;

export const selectMovieErrors = (state: RootState) => state.movies.error;
export const selectIsMovieLoading = (state: RootState) => state.movies.isLoading;
export const selectMoviesMessage = (state: RootState) => state.movies.msg;
export const selectMovies = (state: RootState) => state.movies.movies;

export default movies.reducer;