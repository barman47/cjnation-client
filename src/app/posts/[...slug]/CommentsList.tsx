import { Stack } from '@mui/material';

import Comment from './Comment';
import { Comment as CommentData } from '@/interfaces';

interface Props {
    comments: CommentData[];
}

const CommentsList: React.FC<Props> = ({ comments }) => {
    return (
        <Stack direction="column" spacing={5}>
            {comments.map((comment: CommentData) => (
                <Comment key={comment._id} comment={comment} />
            ))}
        </Stack>
    );
};


export default CommentsList;