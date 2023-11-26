'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Box, Button, Stack, Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

import error from '../../public/assets/error.png';

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

interface Props {
    error: Error & { digest?: string }
    reset: () => void
}

const ErrorPage: React.FC<Props> = ({ reset }) => {
    const { classes } = useStyles();

    return (
        <Box component="main" className={classes.root}>
            <Stack direction="column" spacing={4} alignItems="center">
                <Image 
                    src={error.src}
                    alt="error"
                    width={100}
                    height={100}
                />
                <Typography variant="h5">Ooops something went wrong!</Typography>
                <Typography variant="subtitle1">Looks like we hit a snag. Your expereince is what matters most so a fix is top priority. We’re on it.</Typography>
                <Typography variant="subtitle1">Kindly try again or contact <a href="mailto:support@cjnation.com">support@cjnation.com</a> if this issue persists</Typography>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={reset}
                    >
                        Try Again
                    </Button>
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
            </Stack>
        </Box>
    );
};

export default ErrorPage;