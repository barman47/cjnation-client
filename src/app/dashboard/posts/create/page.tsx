import { PAGE_TITLE } from '@/utils/constants';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: `Create Post | ${PAGE_TITLE}`
};

const CreatePostPage: React.FC<{}> = () => {
    return (
        <div>
            <h1>Create Post Page</h1>
        </div>
    );
};

export default CreatePostPage;