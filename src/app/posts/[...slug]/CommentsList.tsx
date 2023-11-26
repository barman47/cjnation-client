import { Stack } from '@mui/material';

import Comment from './Comment';

const CommentsList: React.FC<{}> = () => {
    return (
        <Stack direction="column" spacing={5}>
            <Comment />
            <Comment />
            <Comment />
            <Comment />
            <Comment />
        </Stack>
    );
};


export default CommentsList;