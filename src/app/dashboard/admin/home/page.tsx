import { Metadata } from 'next';

import { PAGE_TITLE } from '@/utils/constants';
import Dashboard from './Dashboard';

export const metadata: Metadata = {
    title: `Dashboard | ${PAGE_TITLE}`
};

const AdminDashboardPage: React.FC<{}> = () => {
    return (
        <Dashboard />
    );
};

export default AdminDashboardPage;