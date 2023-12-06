'use client';

import * as React from 'react';
import { Divider, Grid } from '@mui/material';
import _ from 'lodash';

import FeaturedPost from './FeaturedPost';
import { Category, Post as PostData } from '@/interfaces';
import PostList from './PostList';
import Categories from '@/components/common/Categories';
import { AppDispatch } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { selectCategory, setCategory } from '@/redux/features/categoriesSlice';
import { getPostsByCategory } from '@/redux/features/postsSlice';
import { setQueryParams } from '@/utils/searchQueryParams';
import AccountVerificationModal from '@/components/common/AccountVerificationModal';
import { ModalRef } from '@/utils/constants';
import { selectIsUserAuthenticated, selectUser } from '@/redux/features/authSlice';
import { selectHasSeenEmailVerificationModal, toggleHasSeenEmailVerificationModal } from '@/redux/features/appSlice';

interface Props {
    categories: Category[];
    posts: PostData[];
    featuredPosts: PostData[];
}

const Home:React.FC<Props> = ({ categories, posts, featuredPosts }) => {
    const dispatch: AppDispatch = useDispatch();
    
    const category = useSelector(selectCategory);
    const user = useSelector(selectUser);
    const isAuthenticated = useSelector(selectIsUserAuthenticated);
    const hasSeenEmailVerificationModal = useSelector(selectHasSeenEmailVerificationModal);
    
    const accountVerificationModalRef = React.useRef<ModalRef | null>(null);

    React.useEffect(() => {
        if (isAuthenticated && !user.emailVerified && !hasSeenEmailVerificationModal) {
            accountVerificationModalRef.current?.openModal();
            dispatch(toggleHasSeenEmailVerificationModal());
        }
    }, [dispatch, isAuthenticated, hasSeenEmailVerificationModal, user]);

    React.useEffect(() => {
        if (!_.isEmpty(category)) {
            setQueryParams('category', category.name.toLowerCase());
        }
    }, [category]);

    return (
        <>
            <AccountVerificationModal ref={accountVerificationModalRef} />
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