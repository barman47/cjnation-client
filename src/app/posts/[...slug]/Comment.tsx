'use client';

import {
    Avatar,
    Stack,
    Typography
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import _ from 'lodash';
import moment from 'moment';

import { OFF_BLACK } from '@/app/theme';
import { Comment as CommentData } from '@/interfaces';
import { capitalize } from '@/utils/capitalize';

const useStyles = makeStyles()(() => ({
    author: {
        color: OFF_BLACK,
        fontWeight: 600
    },

    info: {
        color: OFF_BLACK,
        fontWeight: 300
    }
}));

interface Props {
    comment: CommentData;
}

const Comment: React.FC<Props> = ({ comment }) => {
    const { classes } = useStyles();
    return (
        <Stack direction="row" spacing={2}>
            <Avatar />
            <Stack direction="column" spacing={1}>
                <Stack direction="row" spacing={1}>
                    <Typography variant="subtitle2" className={classes.author}>{typeof comment.user === 'string' ? comment.user : capitalize(comment.user.name)}</Typography>
                    <Typography variant="subtitle2" className={classes.info}>{moment(comment.createdAt).format('MMMM Do, YYYY')}</Typography>
                </Stack>
                <Typography variant="body1">{comment.text}</Typography>
            </Stack>
        </Stack>
    );
};


export default Comment;