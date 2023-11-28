import { 
    Backdrop,
    Box,
    CircularProgress,
} from '@mui/material';

interface Props {
    text?: string
}

const Loading: React.FC<Props> = () => {
    return (
        <Box component="div">
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={true}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    );
};

export default Loading;