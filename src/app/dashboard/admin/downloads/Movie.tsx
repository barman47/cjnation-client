import * as React from 'react';

import Image from 'next/image';
import {
    Stack,
    TableCell,
    TableRow,
    IconButton,
    Tooltip
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { ContentCopy, DeleteOutline, PencilOutline } from 'mdi-material-ui';

import { Movie } from '@/interfaces';
import { capitalize } from '@/utils/capitalize';
import { deleteMovie } from '@/redux/features/moviesSlice';
import { AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { setToast } from '@/redux/features/appSlice';

const useStyles = makeStyles()((theme => ({
    thumbnail: {
        borderRadius: theme.shape.borderRadius,
        objectFit: 'cover',
        objectPosition: 'center',
        width: theme.spacing(10),
        height: theme.spacing(12)
    }
})));

interface Props {
    movie: Movie
}

const Movie: React.FC<Props> = ({ movie }) => {
    const { classes } = useStyles();
    const dispatch: AppDispatch = useDispatch();

    const handleCopyLink = async (): Promise<void> => {
        await navigator.clipboard.writeText(movie.link);
        dispatch(setToast({
            type: 'success',
            message: 'Link copied!'
        }));
    };
    return (
        <TableRow
            key={movie._id}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
            <TableCell align="left" component="th" scope="row">
                <Image 
                    src={movie.thumbnailUrl!}
                    width={80}
                    height={100}
                    alt="Thumbnail"
                    className={classes.thumbnail}
                />
            </TableCell>
            <TableCell align="center">{movie.title}</TableCell>
            <TableCell align="center">{movie.link}</TableCell>
            <TableCell align="center">{typeof movie.genre === 'string' ? capitalize(movie.genre) : capitalize(movie.genre.name)}</TableCell>
            <TableCell align="center">{movie.year}</TableCell>
            <TableCell>
                <Stack direction="row">
                    <Tooltip  title="Edit Movie">
                        <IconButton>
                            <PencilOutline />
                        </IconButton>
                    </Tooltip>
                    <Tooltip  title={`Delete ${movie.title}`}>
                        <IconButton 
                            onClick={() => {
                                if (confirm(`Delete ${movie.title}?`)) {
                                    dispatch(deleteMovie(movie._id!))
                                }
                            }}
                        >
                            <DeleteOutline />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={"Copy movie link"}>
                        <IconButton onClick={handleCopyLink}>
                            <ContentCopy />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </TableCell>
        </TableRow>
    );
}

export default Movie;