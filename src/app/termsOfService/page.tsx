import { Metadata } from 'next';

export const metadata: Metadata = {
    title: `Terms of Service | ${PAGE_TITLE}`
};

import TermsOfService from './TermsOfService';
import { PAGE_TITLE } from '@/utils/constants';

const TermsOfServicePage: React.FC<{}> = () => {
    return (
        <TermsOfService />
    );
};

export default TermsOfServicePage;