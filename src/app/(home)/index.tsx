'use client';

import { Divider, Grid } from '@mui/material';

import FeaturedPost from './FeaturedPost';
import { Category, Post as PostData } from '@/interfaces';
import PostList from './PostList';
import Categories from '@/components/common/Categories';
import { AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { setCategory } from '@/redux/features/categoriesSlice';
import { getPostsByCategory } from '@/redux/features/postsSlice';

interface Props {
    categories: Category[];
    posts: PostData[];
    featuredPosts: PostData[];
}

const Home:React.FC<Props> = ({ categories, posts, featuredPosts }) => {
    const dispatch: AppDispatch = useDispatch();

    return (
        <>
            <Categories 
                categories={categories}
                searchParamName="category"
                getFunction={(categoryId: string) => {
                    dispatch(getPostsByCategory(categoryId));
                }}
                setCategory={(category: Category) => {
                    dispatch(setCategory(category));
                }}
            />
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