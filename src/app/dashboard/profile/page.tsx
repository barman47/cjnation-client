import { PAGE_TITLE } from '@/utils/constants';
import { Metadata } from 'next';
import Profile from './Profile';

export const metadata: Metadata = {
    title: `Profile | ${PAGE_TITLE}`
};

const ProfilePage: React.FC<{}> = () => {
    return (<Profile /> );
};

export default ProfilePage;