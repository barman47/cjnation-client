import * as React from 'react';

import { Stack, Typography } from '@mui/material';
import _ from 'lodash';

import { Music as MusicType } from '@/interfaces';
import Music from './Music';

interface Props {
    musics: MusicType[];
}

const Movies: React.FC<Props> = ({ musics }) => {
    return (
        <Stack 
            direction="row"
            spacing={5}
        > 
            {musics.length ? 
                <Stack direction="column" spacing={2} sx={{ width: '100%' }}>
                    {musics.map((music: MusicType) => (
                        <Music key={music._id} music={music} />
                    ))}
                </Stack>
                :
                <Typography variant="body2">There are no music found</Typography>
            }
        </Stack>
    );
};

export default Movies;