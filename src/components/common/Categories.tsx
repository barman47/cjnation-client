'use client';


import { AppDispatch } from '@/redux/store';
import { 
    Chip,
    Stack,
    Theme
 } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from 'tss-react/mui';

import { Category } from '@/interfaces';
import { selectCategory, setCategory } from '@/redux/features/categoriesSlice';
import { getPostsByCategory } from '@/redux/features/postsSlice';

const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        marginBottom: theme.spacing(3),
        overflowX: 'scroll',
        whiteSpace: 'nowrap', // Prevents the content from wrapping to the next line
        width: '100%', // Set a fixed width or adjust as necessary
        minWidth: '100%'
    }
}));

interface Props {
    categories: Category[];
}

const Categories: React.FC<Props> = ({ categories }) => {
    const { classes } = useStyles();
    const dispatch: AppDispatch = useDispatch();
    const selectedCategory = useSelector(selectCategory);

    useEffect(() => {
        // Select the first category when the categories load
        if (categories.length > 0) {
            dispatch(setCategory(categories[0]));
        }
    }, [categories, dispatch]);

    return (
        <Stack direction="row" spacing={1} className={classes.root}>
            {categories.map((category: Category) => (
                <Chip 
                    key={category._id} 
                    label={category.name} 
                    variant="filled" 
                    onClick={() => {
                        dispatch(getPostsByCategory(category._id!));
                        dispatch(setCategory(category));
                    }}
                    color={category._id === selectedCategory._id ? 'secondary' : 'default'}
                />
            ))}
        </Stack>
    );
};

export default Categories;