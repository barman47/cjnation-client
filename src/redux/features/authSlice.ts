import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

import setAuthToken from '@/utils/setAuthToken';
import { handleError } from '@/utils/handleError';
import { ApiErrorResponse, ApiResponse, Error, SocialLoginData } from '@/utils/constants';
import { User } from '@/interfaces';
import { RootState } from '../store';
import { LoginData, UserRegistrationData } from '@/utils/validation/auth';

export interface AuthError extends Error, User {}

const URL = `${process.env.NEXT_PUBLIC_API}/auth`;

interface AuthState {
    isLoading: boolean;
    isAuthenticated: boolean;
    msg: string | null;
    error: AuthError;
    user: User;
};

const initialState: AuthState = {
    isLoading: false,
    isAuthenticated: false,
    msg: null,
    error: {} as AuthError,
    user: {} as User
};

export const login = createAsyncThunk<ApiResponse, LoginData, { rejectValue: ApiErrorResponse }>('auth/login', async ({ email, password }, { rejectWithValue }) => {
    try {
        const res = await axios.post<ApiResponse>(`${URL}/login`, {
            email,
            password
        });
        setAuthToken(res.data.data.token);
        return res.data;
    } catch (err) {
        return handleError(err, rejectWithValue, 'Failed to login');
    }
});

export const getCurrentUser = createAsyncThunk<ApiResponse, void, { rejectValue: ApiErrorResponse }>('auth/getCurrentUser', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get<ApiResponse>(URL);
        return res.data;
    } catch (err) {
        return handleError(err, rejectWithValue, 'Failed to get user');
    }
});

export const registerUser = createAsyncThunk<ApiResponse, UserRegistrationData, { rejectValue: ApiErrorResponse }>('auth/registerUser', async (data, { rejectWithValue }) => {
    try {
        const res = await axios.post<ApiResponse>(`${URL}/register`, data);
        setAuthToken(res.data.data.token!);
        return res.data;
    } catch (err) {
        return handleError(err, rejectWithValue, 'Failed to register user');
    }
});

export const verifySocialLogin = createAsyncThunk<ApiResponse, SocialLoginData, { rejectValue: ApiErrorResponse }>('auth/verifySocialLogin', async (data, { rejectWithValue }) => {
    try {
        const res = await axios.post<ApiResponse>(`${URL}/socialLogin`, data);
        setAuthToken(res.data.data.token);
        return res.data;
    } catch (err) {
        return handleError(err, rejectWithValue, 'Failed to register user');
    }
});

// export const updateUser = createAsyncThunk<ApiResponse, PetApplicationData, { rejectValue: ApiErrorResponse }>('auth/updateUser', async (data, { rejectWithValue }) => {
//     try {
//         const { _id, previouslyOwnedPet, veterinaryServices, ...rest } = data;
//         const res = await axios.patch<ApiResponse>(`${URL}/updateUser/${_id}`, {
//             ...rest,
//             previouslyOwnedPet: previouslyOwnedPet === 'Yes' ? true : false,
//             veterinaryServices: veterinaryServices === 'Yes' ? true : false
//         });
//         return res.data;
//     } catch (err) {
//         return handleError(err, rejectWithValue, 'Failed to update user data');
//     }
// });

// export const updateUserProfile = createAsyncThunk<ApiResponse, { userData: UserUpdateData, _id: string }, { rejectValue: ApiErrorResponse }>('auth/updateUserProfile', async (data, { rejectWithValue }) => {
//     try { 
//         const res = await axios.patch<ApiResponse>(`${URL}/updateUser/${data._id}`, data.userData);
//         return res.data;
//     } catch (err) {
//         return handleError(err, rejectWithValue, 'Failed to update user data');
//     }
// });

// export const uploadAvatar = createAsyncThunk<ApiResponse, FormData, { rejectValue: ApiErrorResponse }>('auth/uploadAvatar', async (data, { rejectWithValue }) => {
//     try {
//         const res = await axios.patch<ApiResponse>(`${URL}/uploadAvatar`, data);
//         return res.data;
//     } catch (err) {
//         return handleError(err, rejectWithValue, 'Failed to upload image');
//     }
// });

// export const verifyUserEmail = createAsyncThunk<ApiResponse, string, { rejectValue: ApiErrorResponse }>('auth/verifyUserEmail', async (token, { rejectWithValue }) => {
//     try {
//         const res = await axios.get<ApiResponse>(`${URL}/emailVerification/${token}`);
//         setAuthToken(res.data.data.token!);
//         return res.data;
//     } catch (err) {
//         return handleError(err, rejectWithValue, 'Failed to verify user email');
//     }
// });

// export const forgotPassword = createAsyncThunk<ApiResponse, string, { rejectValue: ApiErrorResponse }>('auth/forgotPassword', async (email, { rejectWithValue }) => {
//     try {
//         const res = await axios.post<ApiResponse>(`${URL}/forgotPassword`, { email });
//         setAuthToken(res.data.data.token!);
//         return res.data;
//     } catch (err) {
//         return handleError(err, rejectWithValue, 'Failed to send password reset email');
//     }
// });

// export const resetPassword = createAsyncThunk<ApiResponse, ResetData, { rejectValue: ApiErrorResponse }>('auth/resetPassword', async ({ password, confirmPassword, resetToken }, { rejectWithValue }) => {
//     try {
//         const res = await axios.patch<ApiResponse>(`${URL}/resetPassword/${resetToken}`, { password, confirmPassword });
//         return res.data;
//     } catch (err) {
//         return handleError(err, rejectWithValue, 'Failed to reset password');
//     }
// });

export const auth = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthMessage: (state, action: PayloadAction<string | null>) => {
            state.msg = action.payload
        },

        clearError: (state) => {
            state.error = {} as AuthError;
        },

        logout: (state) => {
            state.isAuthenticated = false;
            state.user = {} as User;
            setAuthToken();
        },
    },
    extraReducers(builder) {
        builder
        .addCase(login.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(login.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
            state.isLoading = false;
            if (action.payload.data?.user) {
                state.isAuthenticated = true;
                state.user = action.payload.data?.user
            }
            if (action.payload.msg) {
                state.msg = action.payload.msg;
            }
        })
        .addCase(login.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload?.data;
        })

        .addCase(registerUser.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            const { user } = action.payload.data;
            state.isAuthenticated = true;
            state.user = { ...user };
            state.isLoading = false;
            state.msg = 'User created successfully';
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload?.data;
        })

        .addCase(verifySocialLogin.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(verifySocialLogin.fulfilled, (state, action) => {
            const { user } = action.payload.data;
            state.isAuthenticated = true;
            state.user = { ...user };
            state.isLoading = false;
            state.msg = 'Login successful';
        })
        .addCase(verifySocialLogin.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload?.data;
        })

        // .addCase(verifyUserEmail.pending, (state) => {
        //     state.isLoading = true;
        // })
        // .addCase(verifyUserEmail.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
        //     state.isLoading = false;
        //     state.isAuthenticated = true;
        //     const { user } = action.payload.data;
        //     state.user = { ...user };
        //     state.msg = action.payload.msg!
        // })
        // .addCase(verifyUserEmail.rejected, (state, action) => {
        //     state.isLoading = false;
        //     state.error = action.payload?.data;
        // })

        .addCase(getCurrentUser.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getCurrentUser.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
            state.isLoading = false;
            state.isAuthenticated = true;
            state.user = action.payload.data;
        })
        .addCase(getCurrentUser.rejected, (state) => {
            setAuthToken();
            state.isLoading = false;
        })

        // .addCase(forgotPassword.pending, (state) => {
        //     state.isLoading = true;
        // })
        // .addCase(forgotPassword.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
        //     state.isLoading = false;
        //     state.msg = action.payload.msg!;
        // })
        // .addCase(forgotPassword.rejected, (state, action) => {
        //     state.isLoading = false;
        //     state.error = action.payload?.data;
        // })

        // .addCase(resetPassword.pending, (state) => {
        //     state.isLoading = true;
        // })
        // .addCase(resetPassword.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
        //     state.isLoading = false;
        //     state.msg = action.payload.msg!;
        // })
        // .addCase(resetPassword.rejected, (state, action) => {
        //     state.isLoading = false;
        //     state.error = action.payload?.data;
        // })

        // .addCase(updateUser.pending, (state) => {
        //     state.isLoading = true;
        // })
        // .addCase(updateUser.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
        //     state.isLoading = false;
        //     state.user = action.payload.data;
        //     state.msg = action.payload.msg!;
        // })
        // .addCase(updateUser.rejected, (state, action) => {
        //     state.isLoading = false;
        //     state.error = action.payload?.data;
        // })

        // .addCase(updateUserProfile.pending, (state) => {
        //     state.isLoading = true;
        // })
        // .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
        //     state.isLoading = false;
        //     state.user = action.payload.data;
        //     state.msg = action.payload.msg!;
        // })
        // .addCase(updateUserProfile.rejected, (state, action) => {
        //     state.isLoading = false;
        //     state.error = action.payload?.data;
        // })

        // .addCase(updateCoverPhoto.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
        //     state.user = action.payload.data;
        // })
        // .addCase(updateCoverPhoto.rejected, (state, action) => {
        //     state.error = action.payload?.data || 'Failed to update cover photo';
        // })

        // .addCase(uploadAvatar.pending, (state) => {
        //     state.isLoading = true;
        // })
        // .addCase(uploadAvatar.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
        //     state.isLoading = false;
        //     state.user = action.payload.data;
        //     state.msg = action.payload.msg!;
        // })
        // .addCase(uploadAvatar.rejected, (state, action) => {
        //     state.isLoading = false;
        //     state.error = action.payload?.data;
        // })
    }
});

export const {
    clearError,
    setAuthMessage,
    logout
} = auth.actions;

export const selectAuthError = (state: RootState) => state.auth.error;
export const selectIsAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthMessage = (state: RootState) => state.auth.msg;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsUserAuthenticated = (state: RootState) => state.auth.isAuthenticated;

export default auth.reducer;