import { Metadata } from 'next';

export const metadata: Metadata = {
    title: `Privacy Policy | ${PAGE_TITLE}`
};

import PrivacyPolicy from './PrivacyPolicy';
import { PAGE_TITLE } from '@/utils/constants';

const PrivacyPolicyPage: React.FC<{}> = () => {
    return (
        <PrivacyPolicy />
    );
};

export default PrivacyPolicyPage;