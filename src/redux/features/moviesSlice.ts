import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { CancelTokenSource } from 'axios';

import { handleError } from '@/utils/handleError';
import { ApiErrorResponse, ApiResponse, Error } from '@/utils/constants';
import { Movie } from '@/interfaces';
import { RootState } from '../store';

export type MovieError = Error & Movie;

let cancelSource: CancelTokenSource | null = null;

const URL = `${process.env.NEXT_PUBLIC_API}/movies`;

interface MovieState {
    isLoading: boolean;
    movie: Movie;
    movies: Movie[];
    msg: string | null;
    error: MovieError;
};

const initialState: MovieState = {
    isLoading: false,
    movie: {} as Movie,
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

export const editMovie = createAsyncThunk<ApiResponse, { data: FormData, movieId: string }, { rejectValue: ApiErrorResponse }>('movies/editMovie', async ({ data, movieId }, { rejectWithValue }) => {
    try {
        const res = await axios.put<ApiResponse>(`${URL}/${movieId}`, data);
        return res.data;
    } catch (err) {
        return handleError(err, rejectWithValue, 'Failed to edit movie');
    }
});

export const getMovies = createAsyncThunk<ApiResponse, void, { rejectValue: ApiErrorResponse }>('movies/getMovies', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get<ApiResponse>(`${URL}`);
        return res.data;
    } catch (err) {
        return handleError(err, rejectWithValue, 'Failed to get movies');
    }
});

export const deleteMovie = createAsyncThunk<ApiResponse, string, { rejectValue: ApiErrorResponse }>('movies/deleteMovie', async (movieId, { rejectWithValue }) => {
    try {
        const res = await axios.delete<ApiResponse>(`${URL}/${movieId}`);
        return res.data;
    } catch (err) {
        return handleError(err, rejectWithValue, 'Failed to get movies');
    }
});

// export const searchMovies = createAsyncThunk<ApiResponse, string, { rejectValue: ApiErrorResponse }>('movies/searchMovies', async (searchText, { rejectWithValue }) => {
//     try {
//         const res = await axios.get<ApiResponse>(`${URL}/search?text=${searchText}`);
//         return res.data;
//     } catch (err) {
//         return handleError(err, rejectWithValue, 'Failed to search movies');
//     }
// });

export const searchMovies = createAsyncThunk<ApiResponse, string, { rejectValue: ApiErrorResponse }>('movies/searchMovies', async (searchText, { rejectWithValue }) => {
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
          return handleError(err, rejectWithValue, 'Failed to search movies');
        }
    }
});

export const movies = createSlice({
    name: 'movies',
    initialState,
    reducers: {
        setMovie: (state, action: PayloadAction<Movie>) => {
            state.movie = action.payload;
        },

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

        .addCase(editMovie.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(editMovie.fulfilled, (state, action) => {
            const editedMovie: Movie = action.payload.data;
            const movieIndex = state.movies.findIndex((movie: Movie) => movie._id === editedMovie._id);
            const movies = [...state.movies];
            movies.splice(movieIndex, 1, editedMovie)
            
            state.isLoading = false;
            state.msg = action.payload.msg || 'Movie edited successfully';
            state.movies = movies;
        })
        .addCase(editMovie.rejected, (state, action) => {
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

        .addCase(searchMovies.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(searchMovies.fulfilled, (state, action) => {
            state.isLoading = false;
            state.movies = action.payload.data;
        })
        .addCase(searchMovies.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload?.data;
        })
        
    }
});

export const {
    clearMovieErrors,
    setMoviesMessage,
    setMovies,
    setMovie
} = movies.actions;

export const selectMovieErrors = (state: RootState) => state.movies.error;
export const selectIsMovieLoading = (state: RootState) => state.movies.isLoading;
export const selectMoviesMessage = (state: RootState) => state.movies.msg;
export const selectMovies = (state: RootState) => state.movies.movies;
export const selectMovie = (state: RootState) => state.movies.movie;

export default movies.reducer;