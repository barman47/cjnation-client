'use client';

import { AppDispatch } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import Post from './Post';
import { Post as PostData } from '@/interfaces';
import { selectPosts, setPosts } from '@/redux/features/postsSlice';

interface Props {
    posts: PostData[];
}

const PostList:React.FC<Props> = ({ posts }) => {
    const dispatch: AppDispatch = useDispatch();

    const postList = useSelector(selectPosts);


    useEffect(() => {
        dispatch(setPosts(posts));
    }, [dispatch, posts]);

    return (
        <>
            {postList.map((post: PostData) => (
                <Post key={post._id} post={post} />
            ))}
        </>
    );
};

export default PostList;