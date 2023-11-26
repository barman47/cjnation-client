import { Like } from '@/interfaces';

export const userLikedPost = (likes: Like[], userId: string):boolean => {
    if (!userId) {
        return false;
    }
    return likes.some((like: Like) => like.user === userId);
};