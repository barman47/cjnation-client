import { notFound } from 'next/navigation';
import { Box, Divider, Stack } from '@mui/material';

import Post from './Post';
import CommentsForm from './CommentsForm';
import CommentsList from './CommentsList';
import { Metadata } from 'next';
import { Post as PostData } from '@/interfaces';

export const dynamicParams = true; // Will generate a page if it does not exist. True is the default

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = params;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/posts/${slug[1]}/${slug[0]}`);

    if (!res.ok) {
        return notFound();
    }

    const data = await res.json();
    const post: PostData = data.data;

    const  title = post.title;
    const  description = post.body.slice(0, 161);
   
    return {
        title: post.title,
        description: post.title.slice(0, 161),
        openGraph: {
            images: [post.mediaUrl!],
        },
        twitter: {
            title,
            card: "summary",
            description,
            creator: 'CJNation',
            images: {
                url: post.mediaUrl!,
                alt: post.slug,
            }
        }
    }
}

export async function generateStaticParams() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/posts`);

    const postData = await res.json();
    const posts: PostData[] = postData.data;

    return posts.map((post: PostData) => ({ _id: post._id }))
}

async function getPost (slug: string, id: string) {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API}/posts/${id}/${slug}`, { next: { 
        revalidate: 10
        // revalidate: 60 * 60 * 24 
    } });
   
	if (!res.ok) {
	    notFound();
	}
	return res.json();
}

async function getCommentsForPost (postId: string) {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API}/comments/${postId}`, { next: { 
        revalidate: 10
        // revalidate: 60 * 60 * 12 
    } });
   
	if (!res.ok) {
	  // This will activate the closest `error.js` Error Boundary
	//   throw new Error('Failed to fetch data')
		console.error('Error ', res);
	}
	return res.json();
}

async function getLikesForPost (postId: string) {

	const res = await fetch(`${process.env.NEXT_PUBLIC_API}/likes/${postId}`, { next: { 
        revalidate: 10 
        // revalidate: 60 * 60 * 12 
    } });
   
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
                <CommentsForm postId={post._id} />
                <CommentsList comments={commentsResponse.data} />
            </Stack>
        </Box>
    );
};

export default PostPage;