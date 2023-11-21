'use client';

import { 
    Chip,
    Stack
 } from '@mui/material';

const Categories: React.FC<{}> = () => {
    return (
        <Stack direction="row" spacing={1}>
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