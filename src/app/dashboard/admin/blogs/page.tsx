import { Metadata } from 'next';

import { PAGE_TITLE } from '@/utils/constants';
import BlogManagement from './BlogManagement';

export const metadata: Metadata = {
    title: `Blog Management | ${PAGE_TITLE}`
};

const BlogsPage: React.FC<{}> = () => {
    return (
        <BlogManagement />
    );
};

export default BlogsPage;