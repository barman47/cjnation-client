'use client';

import * as React from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Button, 
    CircularProgress, 
    FormControl, 
    FormHelperText, 
    Grid, 
    IconButton, 
    MenuItem, 
    Modal,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
    Theme,
    Typography,
    useTheme
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import _ from 'lodash';

import { DARK_GREY, GREY, OFF_BLACK, PRIMARY_COLOR, WHITE } from '@/app/theme';
import { Categories, ModalRef } from '@/utils/constants';
import { Close, CloudUploadOutline } from 'mdi-material-ui';

import { setToast } from '@/redux/features/appSlice';
import { AppDispatch } from '@/redux/store';
import { AddMusicData, EditMusicData, validateAddMusic, validateEditMusic } from '@/utils/validation/music';
import { addMusic, selectIsMusicLoading, selectMusicErrors, clearMusicErrors, selectMusicMessage, setMusicMessage, selectMusic, setMusic as setCurrentMusic, editMusic } from '@/redux/features/musicSlice';
import { capitalize } from '@/utils/capitalize';
import { Category, Music } from '@/interfaces';
import { getCategoriesByType, selectCategoires } from '@/redux/features/categoriesSlice';
import { getYearArray } from '@/utils/getYearArray';
import { getCategoryId } from '@/utils/getCategoryId';

const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        backgroundColor: WHITE,
        borderRadius: '5px',
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        top: '50%',
        left: '50%',
        padding: theme.spacing(0, 2, 2, 2),
        transform: 'translate(-50%, -50%)',
        width: theme.spacing(55),

        [theme.breakpoints.down('sm')]: {
            width: '85%'
        }
    },

    closeButton: {
        alignSelf: 'flex-end'
    },

    imageContainer: {
        width: '100%',
        height: theme.spacing(35)
    },

    image: {
        borderRadius: theme.shape.borderRadius,
        height: '100%',
        width: '100%',
        objectFit: 'cover',
        objectPosition: 'center'
    },

    imageUploadContainer: {
        backgroundColor: GREY,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        border: `1px dashed ${DARK_GREY}`,
        borderRadius: theme.shape.borderRadius,
        height: theme.spacing(7)
    }
}));

interface Props {
    ref: any;
}

const AddMusicModal: React.FC<Props> = React.forwardRef<ModalRef, Props>((_props: Props, ref: any) => {
    const { classes } = useStyles();
    const dispatch: AppDispatch = useDispatch();
    const theme = useTheme();

    const categories = useSelector(selectCategoires);
    const currentMusic = useSelector(selectMusic);
    const musicErrors = useSelector(selectMusicErrors);
    const loading = useSelector(selectIsMusicLoading);
    const msg = useSelector(selectMusicMessage);

    const [title, setTitle] = React.useState('');
    const [artiste, setArtiste] = React.useState('');
    const [imageSrc, setImageSrc] = React.useState<string | ArrayBuffer>('');
    const [image, setImage] = React.useState<File>('' as unknown as File);
    const [musicSrc, setMusicSrc] = React.useState<string | undefined>('');
    const [music, setMusic] = React.useState<File>('' as unknown as File);
    const [genre, setGenre] = React.useState('');
    const [year, setYear] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [errors, setErrors] = React.useState<AddMusicData>({} as AddMusicData);

    const imageUploadRef = React.useRef<HTMLInputElement>(null);
    const musicUploadRef = React.useRef<HTMLInputElement>(null);
    
    const handleOpen = () => setOpen(true);

    const handleClose = React.useCallback(() => {
        if(!loading) {
            dispatch(setCurrentMusic({ } as Music));
            resetForm();
            setOpen(false)
        }
    }, [dispatch, loading]);

    React.useImperativeHandle(ref, () => ({
        openModal: () => {
            handleOpen();
            dispatch(getCategoriesByType(Categories.MUSIC));
        },

        closeModal: () => {
            handleClose();
        }
    }));

    React.useEffect(() => {
        if (!_.isEmpty(currentMusic)) {
            const { title, artiste, genre, mediaUrl, thumbnailUrl, year } = currentMusic;
            setTitle(title);
            setArtiste(artiste);
            if (typeof genre === 'string') {
                setGenre(capitalize(genre));
            } else {
                setGenre(capitalize(genre.name));
            }
            setMusicSrc(mediaUrl!);
            setImageSrc(thumbnailUrl!);
            setYear(year.toString());
        }
    }, [currentMusic]);

    // Handle API error response
    React.useEffect(() => {
        if (!_.isEmpty(musicErrors)) {
            setErrors(musicErrors);
        }
    }, [musicErrors]);

    React.useEffect(() => {
        if (!_.isEmpty(errors)) {
            dispatch(clearMusicErrors());
        }
    }, [dispatch, errors]);

    React.useEffect(() => {
        if (msg) {
            resetForm();
            dispatch(setToast({
                type: 'success',
                message: msg,
            }));
            dispatch(setMusicMessage(null));
            handleClose();
        }
    }, [dispatch, handleClose, msg]);

    const resetForm = () => {
        setTitle('');
        setArtiste('');
        setMusic('' as unknown as File);
        setMusicSrc('');
        setGenre('');
        setYear('');
        setErrors({} as Music);
    };

    const handleSelectImage = (_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        imageUploadRef.current?.click();
    };

    const handleSelectMusic = (_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        musicUploadRef.current?.click();
    };

    const handleRemovePhoto = () => {
        setImage('' as unknown as File);
        setImageSrc('');
    };

    const handleRemoveMusic = () => {
        setMusic('' as unknown as File);
        setMusicSrc('');
    };

    const handleSetImage = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { files } = e.target;
        setImage(files![0]);
        const reader = new FileReader();

        reader.onload = (() => {
            setImageSrc(reader.result!);
        });
        reader.readAsDataURL(files![0]);
    };

    const handleSetAudio = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { files } = e.target;
        setMusic(files![0]);
        const reader = new FileReader();

        reader.onload = (() => {
            setMusicSrc(reader.result?.toString());
        });
        reader.readAsDataURL(files![0]);
    };

    const handleEditMusic = () => {
        const data: EditMusicData = {
            title,
            artiste,
            genre,
            year: year ? parseInt(year) : '' as unknown as number
        };

        const { errors, isValid } = validateEditMusic(data);

        if (!isValid) {
            dispatch(setToast({
                type: 'error',
                message: 'Invalid Music Data!'
            }));
            return setErrors((prev) => ({ ...prev, ...errors }));
        }

        const musicData = new FormData();
        musicData.append('title', title);
        musicData.append('artiste', artiste);
        musicData.append('image', image)
        musicData.append('music', music);
        musicData.append('genre', getCategoryId(genre, categories));
        musicData.append('year', year);

        dispatch(editMusic({ data: musicData, musicId: currentMusic._id! }));
    };

    const handleSubmit = ( event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors({} as AddMusicData);

        if (!_.isEmpty(currentMusic)) {
            return handleEditMusic();
        }

        const data: AddMusicData = {
            title,
            artiste,
            mediaName: musicSrc ? 'something to make this value exist' : '',
            thumbnailName: imageSrc ? 'text-here' : '',
            genre,
            year: year ? parseInt(year) : '' as unknown as number
        };

        const { errors, isValid } = validateAddMusic(data);

        if (!isValid) {
            dispatch(setToast({
                type: 'error',
                message: 'Invalid Music Data!'
            }));
            return setErrors(errors);
        }

        const musicData = new FormData();
        musicData.append('title', title);
        musicData.append('artiste', artiste);
        musicData.append('image', image)
        musicData.append('music', music);
        musicData.append('genre', getCategoryId(genre, categories));
        musicData.append('year', year);

        dispatch(addMusic(musicData));
    };
  
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            disableEscapeKeyDown
        >
            <Box component="section" className={classes.root}>
                <IconButton
                    onClick={handleClose}
                    className={classes.closeButton}
                >
                    <Close />
                </IconButton>
                <Stack direction="column" spacing={2}>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>Upload Music</Typography>
                    <form onSubmit={handleSubmit}>
                        <Stack direction="column" spacing={2}>
                            <TextField 
                                type="text"
                                label="Music Title"
                                variant="outlined"
                                value={title}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                                fullWidth
                                helperText={errors.title}
                                error={errors.title ? true : false}
                                disabled={loading}
                            />
                            <TextField 
                                type="text"
                                label="Artise"
                                variant="outlined"
                                value={artiste}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setArtiste(e.target.value)}
                                fullWidth
                                helperText={errors.artiste}
                                error={errors.artiste ? true : false}
                                disabled={loading}
                            />
                            <input
                                ref={imageUploadRef}
                                accept=".png, .jpg, .webm"
                                style={{ display: 'none' }}
                                onChange={handleSetImage}
                                type="file"
                            />
                            {imageSrc ?
                                <>
                                    <Box component="div" className={classes.imageContainer}>
                                        <Image 
                                            src={imageSrc.toString()}
                                            alt="Post Image"
                                            width={1000}
                                            height={400}
                                            className={classes.image}
                                        />
                                    </Box>
                                    <Button
                                        variant="text"
                                        color="primary"
                                        onClick={handleRemovePhoto}
                                        sx={{ alignSelf: 'flex-start' }}
                                        disabled={loading}
                                    >
                                        Remove Photo
                                    </Button>
                                </>
                                :
                                <>
                                    <Box 
                                        component="div" 
                                        className={classes.imageUploadContainer} 
                                        style={{ 
                                            border: errors.mediaName ? `2px dashed ${theme.palette.error.main}` : `2px dashed ${DARK_GREY}`,
                                        }}
                                    >
                                        <Stack direction="row" spacing={1}>
                                            <CloudUploadOutline sx={{ color: OFF_BLACK }} />
                                            <Typography variant="body2" sx={{ color: OFF_BLACK }}>Upload thumbnail &nbsp;
                                                <Typography component="span" color={PRIMARY_COLOR} sx={{ cursor: 'pointer' }} onClick={handleSelectImage}>here</Typography>
                                            </Typography>
                                        </Stack>
                                    </Box>
                                    {errors.mediaName && <FormHelperText sx={{ color: '#d32f2f' }}>{errors.mediaName}</FormHelperText>}
                                </>
                            }
                            <input
                                ref={musicUploadRef}
                                accept=".mp3"
                                style={{ display: 'none' }}
                                onChange={handleSetAudio}
                                type="file"
                            />
                            {musicSrc ?
                                <>
                                    <audio  
                                        src={musicSrc} 
                                        controls
                                        style={{ width: '100%' }}
                                    >

                                    </audio>
                                    <Button
                                        variant="text"
                                        color="primary"
                                        onClick={handleRemoveMusic}
                                        sx={{ alignSelf: 'flex-start' }}
                                        disabled={loading}
                                    >
                                        Remove Music
                                    </Button>
                                </>
                                :
                                <>
                                    <Box 
                                        component="div" 
                                        className={classes.imageUploadContainer} 
                                        style={{ 
                                            border: errors.mediaName ? `2px dashed ${theme.palette.error.main}` : `2px dashed ${DARK_GREY}`,
                                        }}
                                    >
                                        <Stack direction="row" spacing={1}>
                                            <CloudUploadOutline sx={{ color: OFF_BLACK }} />
                                            <Typography variant="body2" sx={{ color: OFF_BLACK }}>Upload Music &nbsp;
                                                <Typography component="span" color={PRIMARY_COLOR} sx={{ cursor: 'pointer' }} onClick={handleSelectMusic}>here</Typography>
                                            </Typography>
                                        </Stack>
                                    </Box>
                                    {errors.mediaName && <FormHelperText sx={{ color: '#d32f2f' }}>{errors.mediaName}</FormHelperText>}
                                </>
                            }
                            <Grid container direction="row" spacing={1} alignItems="stretch">
                                <Grid item xs={6}>
                                    <FormControl fullWidth>
                                        <Select
                                            value={genre}
                                            onChange={(e: SelectChangeEvent) => setGenre(e.target.value)}
                                            variant="outlined"
                                            displayEmpty
                                            error={errors.genre ? true : false}
                                            disabled={loading}
                                        >
                                            <MenuItem value="" disabled selected>Category</MenuItem>
                                            {categories?.length > 0 && categories.map((category: Category) => (
                                                <MenuItem key={category._id} value={capitalize(category.name)}>{capitalize(category.name)}</MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText sx={{ color: '#d32f2f' }}>{typeof errors.genre === 'string' ? errors.genre : ''}</FormHelperText>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl fullWidth>
                                        <Select
                                            value={year}
                                            onChange={(e: SelectChangeEvent) => setYear(e.target.value)}
                                            variant="outlined"
                                            displayEmpty
                                            error={errors.year ? true : false}
                                            disabled={loading}
                                        >
                                            <MenuItem value="" disabled selected>Year</MenuItem>
                                            {getYearArray(2000).map((year: number) => (
                                                <MenuItem key={year} value={year!}>{year!}</MenuItem>
                                            ))}
                                        </Select>
                                        {errors.year && <FormHelperText sx={{ color: '#d32f2f' }}>{errors.year}</FormHelperText>}
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Button
                                variant="contained"
                                color="secondary"
                                size="large"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? <><CircularProgress />&nbsp;&nbsp;Uploading . . .</> : 'Upload'}
                            </Button>
                        </Stack>
                    </form>
                </Stack>
            </Box>
        </Modal>
    );
});

AddMusicModal.displayName = 'AddMusicModal';

export default AddMusicModal;