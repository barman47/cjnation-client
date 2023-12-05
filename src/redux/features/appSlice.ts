import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface Toast {
    open?: boolean;
    autoHideDuration?: number;
    message: string | null;
    type: 'error' | 'info' | 'success' | 'warning' | null;
}

interface AppState {
    drawerOpen: boolean;
    hasSeenEmailVerificationModal: boolean;
    toast: Toast;
};

const initialToast: Toast = {
    open: false,
    autoHideDuration: 3000,
    message: null,
    type: null
};

const initialState: AppState = {
    drawerOpen: true,
    hasSeenEmailVerificationModal: false,
    toast: initialToast
};

export const app = createSlice({
    name: 'app',
    initialState,
    reducers: {
        toggleHasSeenEmailVerificationModal: (state) => {
            state.hasSeenEmailVerificationModal = !state.hasSeenEmailVerificationModal;
        },

        closeDrawer: (state) => {
            state.drawerOpen = false;
        },

        toggleDrawer: (state) => {
            state.drawerOpen = !state.drawerOpen;
        },

        clearToast: (state) => {
            state.toast = initialToast;
        },

        setToast: (state, action: PayloadAction<Toast>) => {
            const toast: Toast = {
                open: true,
                autoHideDuration: action.payload.autoHideDuration || initialToast.autoHideDuration,
                message: action.payload.message,
                type: action.payload.type || 'success'
            };

            state.toast = toast;
        }
    }
});

export const {
    clearToast,
    closeDrawer,
    setToast,
    toggleDrawer,
    toggleHasSeenEmailVerificationModal
} = app.actions;

export const selectIsDrawerOpen = (state: RootState) => state.app.drawerOpen;
export const selectHasSeenEmailVerificationModal = (state: RootState) => state.app.hasSeenEmailVerificationModal;

export default app.reducer;