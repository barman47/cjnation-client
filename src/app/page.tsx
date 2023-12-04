import { Metadata } from 'next';

import Home from './(home)';
import { PAGE_TITLE } from '@/utils/constants';

export const metadata: Metadata = {
    title: `Home | ${PAGE_TITLE}`
};

async function getPostCategories () {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API}/categories/post`);
   
	if (!res.ok) {
	  // This will activate the closest `error.js` Error Boundary
	//   throw new Error('Failed to fetch data')
		console.error('Error ', res);
	}
	return res.json();
}

async function getPostsByCategory (categoryId: string) {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API}/posts/categories/category/${categoryId}`, { next: {
		revalidate: 10
		// revalidate: 60 * 60 * 24
	} });
   
	if (!res.ok) {
	  // This will activate the closest `error.js` Error Boundary
	//   throw new Error('Failed to fetch data')
		console.error('Error ', res);
	}
	return res.json();
}

async function getFeaturedPosts () {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API}/posts/featured/posts`, { next: {
		revalidate: 10
		// revalidate: 60 * 60 * 24
	} });
   
	if (!res.ok) {
	  // This will activate the closest `error.js` Error Boundary
	//   throw new Error('Failed to fetch data')
		console.error('Error ', res);
	}
	return res.json();
}

const HomePage: React.FC<{}> = async () => {
	const categoriesResponse = await getPostCategories();
	const postsResponse = await getPostsByCategory(categoriesResponse.data[0]._id); // Get posts for the first category
	const featuredPostsResponse = await getFeaturedPosts();

	return (
		<Home categories={categoriesResponse.data} posts={postsResponse.data} featuredPosts={featuredPostsResponse.data} />
	);
}

export default HomePage;
