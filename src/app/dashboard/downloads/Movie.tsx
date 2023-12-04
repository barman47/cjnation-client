'use client';

import Image from 'next/image';
import * as React from 'react';
import {
    Box,
    Stack,
    Typography
} from '@mui/material';
import { Movie } from '@/interfaces';
import Link from 'next/link';
import { makeStyles } from 'tss-react/mui';
import { DARK_GREY, OFF_BLACK } from '@/app/theme';
import { capitalize } from '@/utils/capitalize';

const useStyles = makeStyles()((theme) => ({
    root: {
        backgroundColor: '#F7F7F7',
        borderRadius: theme.shape.borderRadius,
        padding: theme.spacing(2),
        transition: '0.3s linear all',

        '&:hover': {
            backgroundColor: '#F8F8F8',
            boxShadow: '0px 4px 15px 10px #0000001A'
        }
    },

    image: {
        borderRadius: theme.shape.borderRadius,
        objectFit: 'cover',
        objectPosition: 'top'
    },

    title: {
        fontWeight: 500
    },

    text: {
        color: DARK_GREY
    },

    circle: {
        backgroundColor: DARK_GREY,
        borderRadius: '50%',
        width: '3px',
        height: '3px',
    },

    downloadButton: {
        backgroundColor: '#E8E8E8',
        borderRadius: theme.shape.borderRadius,
        color: OFF_BLACK,
        textAlign: 'center',
        textDecoration: 'none',
        padding: theme.spacing(1),

        '&:hover': {
            backgroundColor: theme.palette.primary.main,
            color: '#F8F8F8'
        }
    }
}));

interface Props {
    movie: Movie;
}

const Movie: React.FC<Props> = ({ movie }) => {
    const { classes } = useStyles();

    return (
        <Box component="div" className={classes.root}>
            <Stack direction="column" spacing={1}>
                <Image 
                    src={movie.thumbnailUrl!}
                    width={200}
                    height={250}
                    alt={movie.title}
                    className={classes.image}
                />
                <Typography variant="body1" className={classes.title}>{movie.title}</Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="subtitle1" className={classes.text}>{movie.year}</Typography>
                    <Box component="div" className={classes.circle}></Box>
                    <Typography variant="subtitle1" className={classes.text}>{typeof movie.genre === 'string' ? movie.genre : capitalize(movie.genre.name)}</Typography>
                </Stack>
                <Link target="_blank" href={movie.link} className={classes.downloadButton}>Download</Link>
            </Stack>
        </Box>
    );
};

export default Movie;