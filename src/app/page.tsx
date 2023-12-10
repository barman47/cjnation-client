import { Metadata } from 'next';

import Home from './(home)';
import { PAGE_TITLE } from '@/utils/constants';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
    title: `Home | ${PAGE_TITLE}`,
	description: 'Explore limitless excitement at CJNationent, your premier entertainment destination. Dive into curated movies, diverse music, binge-worthy TV shows, and a comedy treasure trove. Stay in the know with celebrity buzz and upcoming events. Join us for a thrilling journey through the transformative power of entertainment. Let the show begin!'
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
	if (!categoriesResponse.data.length) {
		return notFound();
	}
	const postsResponse = await getPostsByCategory(categoriesResponse.data[0]._id); // Get posts for the first category
	const featuredPostsResponse = await getFeaturedPosts();

	return (
		<Home categories={categoriesResponse.data} posts={postsResponse.data} featuredPosts={featuredPostsResponse.data} />
	);
}

export default HomePage;
