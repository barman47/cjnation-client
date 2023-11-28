import { PAGE_TITLE } from '@/utils/constants';
import { Metadata } from 'next';

import EditPost from './EditPost';

export const metadata: Metadata = {
    title: `Edit Post | ${PAGE_TITLE}`
};

const EditPostPage: React.FC<{}> = () => {
    return (<EditPost />);
};

export default EditPostPage;