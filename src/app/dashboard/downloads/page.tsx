import { Metadata } from 'next';

import { PAGE_TITLE } from '@/utils/constants';
import Downloads from './Downloads';

export const metadata: Metadata = {
    title: `Downloads | ${PAGE_TITLE}`
};

const DownloadsPage: React.FC<{}> = () => {
    return (
        <Downloads />
    );
};

export default DownloadsPage;