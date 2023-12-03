import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
import storage from 'redux-persist/lib/storage/session';

import app from './features/appSlice';
import auth from './features/authSlice';
import categories from './features/categoriesSlice';
import comments from './features/commentsSlice';
import likes from './features/likesSlice';
import movies from './features/moviesSlice';
import music from './features/musicSlice';
import posts from './features/postsSlice';

const rootReducer = combineReducers({
    app,
    auth,
    categories,
    comments,
    likes,
    movies,
    music,
    posts
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth']
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