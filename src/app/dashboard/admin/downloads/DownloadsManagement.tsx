'use client';

import * as React from 'react';

import { 
    Box,
    Button,
    Stack,
    Tab,
    Tabs, 
    Typography
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';

import CustomTabPanel from '@/components/common/CustomTabPanel';
import SearchBox from '@/components/common/SearchBox';
import { LIGHT_GREY, SECONDARY_COLOR } from '@/app/theme';
import MoviesTable from './MoviesTable';
import MusicTable from './MusicTable';
import AddMovieModal from './AddMovieModal';
import { ModalRef } from '@/utils/constants';

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles()((theme) => ({
    title: {
        fontWeight: 600,

        [theme.breakpoints.down('sm')]: {
            textAlign: 'center'
        }
    },

    header: {
        borderBottom: `1px solid ${LIGHT_GREY}`,
        borderTop: `1px solid ${LIGHT_GREY}`,
        height: theme.spacing(12),
        marginTop: theme.spacing(2),
        paddingTop: theme.spacing(2)
    }
}));

const DownloadsManagement: React.FC<{}> = () => {
    const { classes } = useStyles();

    const [value, setValue] = React.useState(0);

    const addMovieModalRef = React.useRef<ModalRef | null>(null);
    const addMusicModalRef = React.useRef<ModalRef | null>(null);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleOpenAddMovieModal = (): void => {
        addMovieModalRef.current?.openModal()
    };

    const handleOpenAddMusicModal = (): void => {
        addMusicModalRef.current?.openModal()
    };

    return (
        <>
            <AddMovieModal ref={addMovieModalRef} />
            <Box component="main">
                <Typography variant="h5" className={classes.title}>Downloads Management</Typography>
                <Stack 
                    direction="row" 
                    alignItems="flex-end" 
                    justifyContent="space-between" 
                    className={classes.header}
                >
                    <Box>
                        <Tabs 
                            value={value} 
                            textColor="primary" 
                            indicatorColor="primary" 
                            onChange={handleChange} 
                            aria-label="post-tabs"
                            sx={{ borderBottom: 1, borderColor: 'divider' }}
                        >
                            <Tab sx={{ textTransform: 'none' }} label="Movies" disableRipple disableFocusRipple {...a11yProps(0)} />
                            <Tab sx={{ textTransform: 'none' }} label="Music" disableRipple disableFocusRipple {...a11yProps(1)} />
                        </Tabs>
                    </Box>
                    <Stack direction="row" spacing={5} alignItems="center" alignSelf="flex-start">
                        <SearchBox />
                        {value === 0 ?
                            <Button
                                variant="outlined"
                                color="secondary"
                                size="large"
                                sx={{ color: SECONDARY_COLOR }}
                                onClick={handleOpenAddMovieModal}
                            >
                                Add Movie
                            </Button>
                            :
                            <Button
                                variant="outlined"
                                color="secondary"
                                size="large"
                                sx={{ color: SECONDARY_COLOR }}
                                onClick={handleOpenAddMusicModal}
                            >
                                Add Music
                            </Button>
                        }
                    </Stack>
                </Stack>
                <CustomTabPanel value={value} index={0}>
                    <MoviesTable />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <MusicTable />
                </CustomTabPanel>
            </Box>
        </>
    );
};

export default DownloadsManagement;