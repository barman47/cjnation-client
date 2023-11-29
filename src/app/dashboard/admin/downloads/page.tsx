import { Metadata } from 'next';

import { PAGE_TITLE } from '@/utils/constants';
import DownloadsManagement from './DownloadsManagement';

export const metadata: Metadata = {
    title: `Downloads Management | ${PAGE_TITLE}`
};

const DownloadsManagementPage: React.FC<{}> = () => {
    return (
        <DownloadsManagement />
    );
};

export default DownloadsManagementPage;