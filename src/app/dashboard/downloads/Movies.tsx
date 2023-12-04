import * as React from 'react';

import { Box, Stack, Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import _ from 'lodash';

import Movie from './Movie';
import { Movie as MovieType } from '@/interfaces';
import { theme } from '@/app/theme';

const useStyles = makeStyles()(() => ({
    movies: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing(5),
        width: '100%',

        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            alignItems: 'center'
        }
    }
}));

interface Props {
    movies: MovieType[];
}

const Movies: React.FC<Props> = ({ movies }) => {
    const { classes } = useStyles();

    return (
        <Stack 
            direction="row"
            spacing={5}
        > 
            {movies.length ? 
                <Box component="div" className={classes.movies}>
                    {movies.map((movie: MovieType) => (
                        <Movie key={movie._id} movie={movie} />
                    ))}
                </Box>
                :
                <Typography variant="body2">There are no movies found</Typography>
            }
        </Stack>
    );
};

export default Movies;