import { Metadata } from 'next';

import { PAGE_TITLE } from '@/utils/constants';
import ResetPasswordForm from './ResetPasswordForm';

export const metadata: Metadata = {
    title: `Reset Password | ${PAGE_TITLE}`
};

const ResetPasswordPage: React.FC<{}> = () => {

	return (<ResetPasswordForm />);
}

export default ResetPasswordPage;
