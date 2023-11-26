import { Box, Divider, Stack } from '@mui/material';

import Post from './Post';
import CommentsForm from './CommentsForm';
import CommentsList from './CommentsList';
import { notFound } from 'next/navigation';

async function getPost (slug: string, id: string) {

	const res = await fetch(`${process.env.NEXT_PUBLIC_API}/posts/${id}/${slug}`, { cache: 'no-store' });
   
	if (!res.ok) {
	  // This will activate the closest `error.js` Error Boundary
	//   throw new Error('Failed to fetch data')
		console.error('Error ', res);
	}
	return res.json();
}

async function getCommentsForPost (postId: string) {

	const res = await fetch(`${process.env.NEXT_PUBLIC_API}/comments/${postId}`, { cache: 'no-store' });
   
	if (!res.ok) {
	  // This will activate the closest `error.js` Error Boundary
	//   throw new Error('Failed to fetch data')
		console.error('Error ', res);
	}
	return res.json();
}

async function getLikesForPost (postId: string) {

	const res = await fetch(`${process.env.NEXT_PUBLIC_API}/likes/${postId}`, { cache: 'no-store' });
   
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
    const post = res.data;

    if (!post) {
        return notFound();
    }

    const commentsResponse = await getCommentsForPost(post._id);
    const likesResponse = await getLikesForPost(post._id);

    return (
        <Box component="main">
            <Stack direction="column" spacing={3}>
                <Post post={post} likes={likesResponse.data} />
                <Divider />
                <CommentsForm numberOfComments={post.comments} postId={post._id} />
                <CommentsList comments={commentsResponse.data} />
            </Stack>
        </Box>
    );
};

export default PostPage;