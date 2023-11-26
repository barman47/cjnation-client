import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

import { handleError } from '@/utils/handleError';
import { ApiErrorResponse, ApiResponse, Categories, Error } from '@/utils/constants';
import { Category } from '@/interfaces';
import { RootState } from '../store';

export type CategoryError = Error & Category;

const URL = `${process.env.NEXT_PUBLIC_API}/categories`;

interface Categorytate {
    isLoading: boolean;
    category: Category;
    categories: Category[];
    msg: string | null;
    error: CategoryError;
};

const initialState: Categorytate = {
    isLoading: false,
    category: {} as Category,
    categories: [],
    msg: null,
    error: {} as CategoryError
};

export const getCategoriesByType = createAsyncThunk<ApiResponse, Categories, { rejectValue: ApiErrorResponse }>('categories/getCategoriesByType', async (categoryType, { rejectWithValue }) => {
    try {
        const res = await axios.get<ApiResponse>(`${URL}/${categoryType}`);
        return res.data;
    } catch (err) {
        return handleError(err, rejectWithValue, 'Failed to get categories');
    }
});

export const categories = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        setCategory: (state, action: PayloadAction<Category | null>) => {
            state.category = action.payload || {} as Category;
        },
        setCategoriesMessage: (state, action: PayloadAction<string | null>) => {
            state.msg = action.payload
        },
        clearCategoriesErrors: (state) => {
            state.error = {} as CategoryError;
        },
    },
    extraReducers(builder) {
        builder
        .addCase(getCategoriesByType.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getCategoriesByType.fulfilled, (state, action) => {
            state.isLoading = false;
            state.categories = action.payload.data;
        })
        .addCase(getCategoriesByType.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload?.data;
        })
        
    }
});

export const {
    clearCategoriesErrors,
    setCategoriesMessage,
    setCategory
} = categories.actions;

export const selectCategoryErrors = (state: RootState) => state.categories.error;
export const selectIsCategoiresLoading = (state: RootState) => state.categories.isLoading;
export const selectCategoiresMessage = (state: RootState) => state.categories.msg;
export const selectCategory = (state: RootState) => state.categories.category;
export const selectCategoires = (state: RootState) => state.categories.categories;

export default categories.reducer;