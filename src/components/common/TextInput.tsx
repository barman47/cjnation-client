'use client';

import { makeStyles } from 'tss-react/mui';
import { 
    Box,
    Theme,
    Typography 
} from '@mui/material';

const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column'
    },

    labal: {
        marginBottom: theme.spacing(0.5),
        color: theme.palette.grey[700]
    },

    secondaryElement: {
        marginTop: theme.spacing(0.5),
        marginLeft: theme.spacing(1)
    }
}));

interface Props {
    input: JSX.Element;
    label?: string;
    secondaryElement?: JSX.Element;
}

const TextInput: React.FC<Props> = ({ input, label, secondaryElement }) => {
    const { classes } = useStyles();

    return (
        <Box
            component="div"
            className={classes.root}
        >
            {label && <Typography variant="body2" component="small" className={classes.labal}>{label}</Typography>}
            {input}
            {secondaryElement && 
                <Box component="div" className={classes.secondaryElement}>
                    {secondaryElement}
                </Box>
            }
        </Box>
    );
};

export default TextInput;