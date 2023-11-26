'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Box, Button, Stack, Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

import notFound from '../../public/assets/404.png';

const useStyles = makeStyles()(() => ({
    root: {
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '85vh',
        textAlign: 'center'
    }
}));

const NotFoundPage: React.FC<{}> = () => {
    const { classes } = useStyles();

    return (
        <Box component="main" className={classes.root}>
            <Stack direction="column" spacing={4} alignItems="center">
                <Image 
                    src={notFound.src}
                    alt="error"
                    width={150}
                    height={150}
                />
                <Typography variant="h6">This page you tried to visit doesn&#39;t exist.</Typography>
                <Typography variant="subtitle1">Head over to the homepage that definitely does exist.</Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    LinkComponent={Link}
                    href="/"
                >
                    Back Home
                </Button>
            </Stack>
        </Box>
    );
};

export default NotFoundPage;