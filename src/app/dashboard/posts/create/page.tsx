import { PAGE_TITLE } from '@/utils/constants';
import { Metadata } from 'next';

import CreatePost from './CreatePost';

export const metadata: Metadata = {
    title: `Create Post | ${PAGE_TITLE}`
};

const CreatePostPage: React.FC<{}> = () => {
    return (<CreatePost />);
};

export default CreatePostPage;