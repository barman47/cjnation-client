'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

import { selectIsUserAuthenticated } from '@/redux/features/authSlice';

interface Props {
    children: React.ReactElement
}

const Dashboard: React.FC<Props> = ({ children }) => {
    const router = useRouter();
    const isAuthenticated = useSelector(selectIsUserAuthenticated);

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return null;
    }
    
    return (
        <>
            {children}
        </>
    );
};

export default Dashboard;