import { Box, Divider, Stack } from '@mui/material';

import Post from './Post';
import CommentsForm from './CommentsForm';
import CommentsList from './CommentsList';

async function getPost (slug: string, id: string) {

	const res = await fetch(`${process.env.NEXT_PUBLIC_API}/posts/${id}/${slug}`);
   
	if (!res.ok) {
	  // This will activate the closest `error.js` Error Boundary
	//   throw new Error('Failed to fetch data')
		console.error('Error ', res);
	}
	return res.json();
}

interface Props {
    params: {
        slug: string[];
    }
}

const PostPage: React.FC<Props> = async ({ params }) => {
    const { slug } = params;
    const res = await getPost(slug[0], slug[1]);

    return (
        <Box component="main">
            <Stack direction="column" spacing={3}>
                <Post />
                <Divider />
                <CommentsForm />
                <CommentsList />
            </Stack>
        </Box>
    );
};

export default PostPage;