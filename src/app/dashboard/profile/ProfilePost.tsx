import * as React from 'react';

import { Divider, IconButton, Stack, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import { DotsHorizontal } from 'mdi-material-ui';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()(() => ({
    title: {
        fontWeight: 500,
        display: '-webkit-box',
        overflow: 'hidden',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 2
    },

    timestamp: {
        fontWeight: 300
    }
}));

interface Props {
    title: string;
    createdAt: string;
    loading: boolean;
    handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const  ProfilePost: React.FC<Props> = ({ loading, title, createdAt, handleClick }) => {
    const { classes } = useStyles();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <>
            <Stack direction="row" alignItems="center" justifyContent="space-between" component="div" py={matches ? 1 : 2}>
                <Stack direction="column" spacing={1}>
                    <Typography variant="body1" className={classes.title}>{title}</Typography>
                    <Typography variant="subtitle2" className={classes.timestamp}>Created {createdAt}</Typography>
                </Stack>
                <Tooltip title="More" arrow placement="top">
                    <IconButton
                        disableFocusRipple
                        disableRipple
                        disableTouchRipple
                        onClick={handleClick}
                        disabled={loading}
                    >
                        <DotsHorizontal />
                    </IconButton>
                </Tooltip>
            </Stack>
            <Divider />
        </>
    );
};

export default ProfilePost;