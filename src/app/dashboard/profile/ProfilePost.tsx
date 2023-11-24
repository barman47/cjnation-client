import * as React from 'react';

import { Divider, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { DotsHorizontal } from 'mdi-material-ui';

interface Props {
    title: string;
    createdAt: string;
    handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const  ProfilePost: React.FC<Props> = ({ title, createdAt, handleClick }) => {
    return (
        <>
            <Stack direction="row" alignItems="center" justifyContent="space-between" component="div" py={2}>
                <Stack direction="column" spacing={1}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{title}</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 300 }}>Created {createdAt}</Typography>
                </Stack>
                <Tooltip title="More" arrow placement="top">
                    <IconButton
                        disableFocusRipple
                        disableRipple
                        disableTouchRipple
                        onClick={handleClick}
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