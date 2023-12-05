import { Metadata } from 'next';

import { PAGE_TITLE } from '@/utils/constants';
import EmailVerification from './EmailVerification';

export const metadata: Metadata = {
    title: `Email Verification | ${PAGE_TITLE}`
};

const EmailVerificationPage: React.FC<{}> = () => {
    return (
        <EmailVerification />
    );
};

export default EmailVerificationPage;