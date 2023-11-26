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
        <div>
            <h1>Post Page</h1>
        </div>
    );
};

export default PostPage;