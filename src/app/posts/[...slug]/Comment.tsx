'use client';

import {
    Avatar,
    Stack,
    Typography
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import _ from 'lodash';
import { OFF_BLACK } from '@/app/theme';

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

const Comment: React.FC<{}> = () => {
    const { classes } = useStyles();
    return (
        <Stack direction="row" spacing={2}>
            <Avatar />
            <Stack direction="column" spacing={1}>
                <Stack direction="row" spacing={1}>
                    <Typography variant="subtitle2" className={classes.author}>John Akano</Typography>
                    <Typography variant="subtitle2" className={classes.info}>Aug 22nd, 2023</Typography>
                </Stack>
                <Typography variant="body1">This piece was such a good read. Keep it up bro</Typography>
            </Stack>
        </Stack>
    );
};


export default Comment;