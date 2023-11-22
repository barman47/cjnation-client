'use client';

import { 
    Chip,
    Stack
 } from '@mui/material';
 import { makeStyles } from 'tss-react/mui';

 const useStyles = makeStyles()(() => ({
    root: {
        overflowX: 'scroll'
    }
 }));

const Categories: React.FC<{}> = () => {
    const { classes } = useStyles();

    return (
        <Stack direction="row" spacing={1} className={classes.root}>
            <Chip label="Entertainment" variant="filled" color="secondary" onClick={() => {}} />
            <Chip label="Gossips" variant="filled" onClick={() => {}} />
            <Chip label="Football" variant="filled" onClick={() => {}} />
            <Chip label="Music" variant="filled" onClick={() => {}} />
            <Chip label="Video" variant="filled" onClick={() => {}} />
            <Chip label="Ctegory" variant="filled" onClick={() => {}} />
            <Chip label="Category" variant="filled" onClick={() => {}} />
            <Chip label="Category" variant="filled" onClick={() => {}} />
            <Chip label="Category" variant="filled" onClick={() => {}} />
        </Stack>
    );
};

export default Categories;