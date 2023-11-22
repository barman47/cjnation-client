'use client';

import { ReactNode } from 'react';
import { InputAdornment, TextField } from '@mui/material';
import { Magnify } from 'mdi-material-ui';
import { Theme } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        '& .MuiOutlinedInput-root': {
            borderRadius: '50px',
            width: theme.spacing(50)
        }
    }
}));

interface Props {
    placeholder?: string;
    icon?: ReactNode;
}

const SearchBox: React.FC<Props> = ({ placeholder, icon }) => {
    const { classes } = useStyles();

    return (
        <form>
            <TextField 
                variant="outlined"
                placeholder={placeholder ?? 'Search'}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            {icon ?? <Magnify />}
                        </InputAdornment>
                    )
                }}
                classes={{ root: classes.root }}
            />
        </form>
    );
};

export default SearchBox;