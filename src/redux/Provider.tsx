'use client'

import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';

import Toast from '@/components/common/Toast';
// import store from './store';
import store, { persistor } from './store';


export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <Toast />
                {children}
            </PersistGate>
        </Provider>
    );
}