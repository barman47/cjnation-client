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
import { DeleteOutline, PencilOutline } from 'mdi-material-ui';
import { useDispatch } from 'react-redux';

import { Music } from '@/interfaces';
import { capitalize } from '@/utils/capitalize';
import { deleteMusic } from '@/redux/features/musicSlice';
import { AppDispatch } from '@/redux/store';

const useStyles = makeStyles()((theme => ({
    cover: {
        borderRadius: theme.shape.borderRadius,
        objectFit: 'cover',
        objectPosition: 'center',
        width: theme.spacing(10),
        height: theme.spacing(12)
    }
})));

interface Props {
    music: Music;
    handleEditMusic: (music: Music) => void;
}

const Music: React.FC<Props> = ({ handleEditMusic, music }) => {
    const { classes } = useStyles();
    const dispatch: AppDispatch = useDispatch();

    return (
        <TableRow
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
            <TableCell component="th" scope="row">
                <Image 
                    src={music.thumbnailUrl!}
                    width={80}
                    height={100}
                    alt="Thumbnail"
                    className={classes.cover}
                />
            </TableCell>
            <TableCell align="center">{music.title}</TableCell>
            <TableCell align="center">{music.artiste}</TableCell>
            <TableCell align="center">{typeof music.genre === 'string' ? capitalize(music.genre) : capitalize(music.genre.name)}</TableCell>
            <TableCell align="center">
                <audio src={music.mediaUrl!} controls></audio>
            </TableCell>
            <TableCell>
                <Stack direction="row">
                    <Tooltip title="Edit Music">
                        <IconButton onClick={() => handleEditMusic(music)}>
                            <PencilOutline />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={`Delete ${music.title}`}>
                        <IconButton
                            onClick={() => {
                                if (confirm(`Delete ${music.title}?`)) {
                                    dispatch(deleteMusic(music._id!));
                                }
                            }}
                        >
                            <DeleteOutline />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </TableCell>
        </TableRow>
    );
}

export default Music;