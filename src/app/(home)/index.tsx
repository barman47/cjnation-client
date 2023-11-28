import { Divider, Grid } from '@mui/material';

import FeaturedPost from './FeaturedPost';
import { Post as PostData } from '@/interfaces';
import PostList from './PostList';

interface Props {
    posts: PostData[];
    featuredPosts: PostData[];
}

const Home:React.FC<Props> = ({ posts, featuredPosts }) => {
    return (
        <>
            <Grid container direction="row" spacing={1}>
                <Grid item xs={12} lg={8}>
                    <PostList posts={posts} />
                </Grid>
                <Grid item xs={12} lg={0.5}>
                    <Divider orientation="vertical" />
                </Grid>
                <Grid item xs={12} lg={3.5}>
                    {featuredPosts.map((post: PostData) => (
                        <FeaturedPost key={post._id} post={post} />
                    ))}
                </Grid>
            </Grid>
        </>
    );
};

export default Home;