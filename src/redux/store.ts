import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
import storage from 'redux-persist/lib/storage/session';

import app from './features/appSlice';
import auth from './features/authSlice';

const rootReducer = combineReducers({
    app,
    auth
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'breeds', 'species']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const storeConfig = {
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== 'production'
};

const store = configureStore(storeConfig);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;