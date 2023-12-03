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

export const getPost = createAsyncThunk<ApiResponse, string, { rejectValue: ApiErrorResponse }>('posts/getPost', async (postId, { rejectWithValue }) => {
    try {
        const res = await axios.get<ApiResponse>(`${URL}/${postId}`);
        return res.data;
    } catch (err) {
        return handleError(err, rejectWithValue, 'Failed to get post');
    }
});

export const getPendingPosts = createAsyncThunk<ApiResponse, void, { rejectValue: ApiErrorResponse }>('posts/getPendingPosts', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get<ApiResponse>(`${URL}/pending/posts`);
        return res.data;
    } catch (err) {
        return handleError(err, rejectWithValue, 'Failed to get pending post');
    }
});

export const getPublishedPosts = createAsyncThunk<ApiResponse, void, { rejectValue: ApiErrorResponse }>('posts/getPublishedPosts', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get<ApiResponse>(`${URL}/published/posts`);
        return res.data;
    } catch (err) {
        return handleError(err, rejectWithValue, 'Failed to get published post');
    }
});

export const createDraft = createAsyncThunk<ApiResponse, FormData, { rejectValue: ApiErrorResponse }>('posts/createDraft', async (draft, { rejectWithValue }) => {
    try {
        const res = await axios.post<ApiResponse>(`${URL}/drafts`, draft);
        return res.data;
    } catch (err) {
        return handleError(err, rejectWithValue, 'Failed to save post');
    }
});

export const saveDraft = createAsyncThunk<ApiResponse, {draft: FormData, postId: string }, { rejectValue: ApiErrorResponse }>('posts/saveDraft', async ({ draft, postId}, { rejectWithValue }) => {
    try {
        const res = await axios.patch<ApiResponse>(`${URL}/drafts/save/${postId}`, draft);
        return res.data;
    } catch (err) {
        return handleError(err, rejectWithValue, 'Failed to save draft');
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

export const getPostsForUser = createAsyncThunk<ApiResponse, void, { rejectValue: ApiErrorResponse }>('posts/getPostsForUser', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get<ApiResponse>(`${URL}/user/posts`);
        return res.data;
    } catch (err) {
        return handleError(err, rejectWithValue, 'Failed to get user\'s posts');
    }
});

export const editPost = createAsyncThunk<ApiResponse, { post: FormData, postId: string }, { rejectValue: ApiErrorResponse }>('posts/editPost', async ({ post, postId}, { rejectWithValue }) => {
    try {
        const res = await axios.put<ApiResponse>(`${URL}/${postId}`, post);
        return res.data;
    } catch (err) {
        return handleError(err, rejectWithValue, 'Failed to save post');
    }
});

export const publishPost = createAsyncThunk<ApiResponse, string, { rejectValue: ApiErrorResponse }>('posts/publishPost', async (postId, { rejectWithValue }) => {
    try {
        const res = await axios.patch<ApiResponse>(`${URL}/publishPost/${postId}`);
        return res.data;
    } catch (err) {
        return handleError(err, rejectWithValue, 'Failed to publish post');
    }
});

export const deletePost = createAsyncThunk<ApiResponse, string, { rejectValue: ApiErrorResponse }>('posts/deletePost', async (postId, { rejectWithValue }) => {
    try {
        const res = await axios.delete<ApiResponse>(`${URL}/${postId}`);
        return res.data;
    } catch (err) {
        return handleError(err, rejectWithValue, 'Failed to delete post');
    }
});

export const removePostImage = createAsyncThunk<ApiResponse, { postId: string; mediaName: string }, { rejectValue: ApiErrorResponse }>('posts/removePostImage', async ({ postId, mediaName }, { rejectWithValue }) => {
    try {
        const res = await axios.patch<ApiResponse>(`${URL}/image/remove/${postId}`, { mediaName });
        return res.data;
    } catch (err) {
        return handleError(err, rejectWithValue, 'Failed to remove post image');
    }
});

export const approvePost = createAsyncThunk<ApiResponse, string , { rejectValue: ApiErrorResponse }>('posts/approvePost', async (postId, { rejectWithValue }) => {
    try {
        const res = await axios.patch<ApiResponse>(`${URL}/approvePost/${postId}`);
        return res.data;
    } catch (err) {
        return handleError(err, rejectWithValue, 'Failed to approve post');
    }
});

export const rejectPost = createAsyncThunk<ApiResponse, { postId: string; rejectionReason: string }, { rejectValue: ApiErrorResponse }>('posts/rejectPost', async ({ postId, rejectionReason }, { rejectWithValue }) => {
    try {
        const res = await axios.patch<ApiResponse>(`${URL}/rejectPost/${postId}`, { rejectionReason });
        return res.data;
    } catch (err) {
        return handleError(err, rejectWithValue, 'Failed to reject post');
    }
});

export const posts = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        setPost: (state, action: PayloadAction<Post>) => {
            state.post = action.payload;
        },

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
        .addCase(getPost.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getPost.fulfilled, (state, action) => {
            state.isLoading = false;
            state.post = action.payload.data;
        })
        .addCase(getPost.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload?.data;
        })

        .addCase(getPendingPosts.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getPendingPosts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.posts = action.payload.data;
        })
        .addCase(getPendingPosts.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload?.data;
        })

        .addCase(getPublishedPosts.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getPublishedPosts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.posts = action.payload.data;
        })
        .addCase(getPublishedPosts.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload?.data;
        })

        .addCase(createDraft.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(editPost.fulfilled, (state, action) => {
            state.isLoading = false;
            state.post = action.payload.data;
            state.msg = action.payload.msg || 'Your blog has been saved succcessfully. You can always come back and continue writing.';
        })
        .addCase(editPost.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload?.data;
        })

        .addCase(editPost.pending, (state) => {
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

        .addCase(saveDraft.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(saveDraft.fulfilled, (state, action) => {
            state.isLoading = false;
            state.post = action.payload.data;
            state.msg = action.payload.msg || 'Your blog has been saved succcessfully. You can always come back and continue writing.';
        })
        .addCase(saveDraft.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload?.data;
        })

        .addCase(createPost.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(createPost.fulfilled, (state, action) => {
            state.isLoading = false;
            state.post = action.payload.data;
            state.msg = action.payload.msg || 'Your blog has been submitted and will be reviewed and approved shortly by an admin';
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

        .addCase(getPostsForUser.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getPostsForUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.posts = [...action.payload.data];
        })
        .addCase(getPostsForUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload?.data;
        })

        .addCase(publishPost.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(publishPost.fulfilled, (state, action) => {
            const post = action.payload.data;
            const posts = [...state.posts];
            const postIndex = posts.findIndex((item: Post) => item._id === post._id);
            posts.splice(postIndex, 1, post);
            state.isLoading = false;
            state.posts = [...posts];
            state.msg = action.payload.msg || 'Post published successfully';
        })
        .addCase(publishPost.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload?.data;
        })

        .addCase(deletePost.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(deletePost.fulfilled, (state, action) => {
            const post = action.payload.data;
            state.posts = state.posts.filter((item: Post) => post._id !== item._id);
            state.msg = action.payload.msg || 'Post deleted successfully';
            state.isLoading = false;
        })
        .addCase(deletePost.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload?.data;
        })

        .addCase(removePostImage.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(removePostImage.fulfilled, (state, action) => {
            state.post = action.payload.data
            state.isLoading = false;
        })
        .addCase(removePostImage.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload?.data;
        })

        .addCase(approvePost.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(approvePost.fulfilled, (state, action) => {
            state.isLoading = false;
            state.msg = action.payload.msg || 'Post approved successfully'
        })
        .addCase(approvePost.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload?.data;
        })

        .addCase(rejectPost.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(rejectPost.fulfilled, (state, action) => {
            state.isLoading = false;
            state.msg = action.payload.msg || 'Post rejected successfully'
        })
        .addCase(rejectPost.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload?.data;
        })
    }
});

export const {
    clearError,
    setPost,
    setPosts,
    setPostMessage,
} = posts.actions;

export const selectPostErrors = (state: RootState) => state.posts.error;
export const selectIsPostLoading = (state: RootState) => state.posts.isLoading;
export const selectPostMessage = (state: RootState) => state.posts.msg;
export const selectPost = (state: RootState) => state.posts.post;
export const selectPosts = (state: RootState) => state.posts.posts;

export default posts.reducer;