import { PAGE_TITLE } from '@/utils/constants';
import { Metadata } from 'next';
import ReviewPost from './ReviewPost';


export const metadata: Metadata = {
    title: `Review Post | ${PAGE_TITLE}`
};

const EditPostPage: React.FC<{}> = () => {
    return (
        <ReviewPost />
    );
};

export default EditPostPage;