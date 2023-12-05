'use client';

import Image from 'next/image';
import * as React from 'react';
import {
    IconButton,
    Stack,
    Typography
} from '@mui/material';
import {  Music } from '@/interfaces';
import { makeStyles } from 'tss-react/mui';

import { DARK_GREY } from '@/app/theme';
import { DownloadCircle, PauseCircle, PlayCircle } from 'mdi-material-ui';


const useStyles = makeStyles()((theme) => ({
    image: {
        borderRadius: theme.shape.borderRadius,
        objectFit: 'cover',
        objectPosition: 'top'
    },

    text: {
        color: DARK_GREY
    }
}));

interface Props {
    music: Music;
}

const Music: React.FC<Props> = ({ music }) => {
    const { classes } = useStyles();

    const [isPlaying, setIsPlaying] = React.useState(false);

    const audioRef = React.useRef<HTMLAudioElement>(null);

    const pause = (): void => {
        audioRef.current?.pause();
    };

    const play = (): void => {
        audioRef.current?.play();
    };

    const download = (): void => {
        const link = document.createElement('a');
        link.href = music.mediaUrl!; // Set the download URL to the music mediaUrl
        link.download = `${music.title}-${music.artiste}.mp3`; // Set the download filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // const download = async (): Promise<void> => {
    //     try {
    //         const response = await fetch(music.mediaUrl!);
    //         const blob = await response.blob();

    //         const link = document.createElement('a');
    //         link.href = URL.createObjectURL(blob);
    //         link.download = `${music.title}-${music.artiste}.mp3`;
    //         document.body.append(link);
    //         link.click();
    //         document.body.removeChild(link);
    //     } catch (err) {
    //         dispatch(setToast({
    //             type: 'error',
    //             message: 'Error downloading file'
    //         }));
    //     }
    // };

    const handleClick = (): void => {
        setIsPlaying((prev) => {
            if (prev) {
                pause();
            } else {
                play();
            }
            return !prev;
        });
    };

    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{ width: '100%' }}>
            <audio src={music.mediaUrl!} ref={audioRef}></audio>
            <Stack direction="row" spacing={1} alignItems="center">
                <Image 
                    src={music.thumbnailUrl!}
                    width={40}
                    height={40}
                    alt={music.title}
                    className={classes.image}
                />
                <Typography variant="subtitle2">{music.title}-{music.artiste}</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
                <IconButton onClick={handleClick} color="primary" size="large"> 
                    {isPlaying  ? <PauseCircle /> : <PlayCircle /> }
                </IconButton>
                <IconButton size="large" onClick={download}>
                    <DownloadCircle />
                </IconButton>
                <Typography variant="body2">23.5K</Typography>
            </Stack>
        </Stack>
    );
};

export default Music;