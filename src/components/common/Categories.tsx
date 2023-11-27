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
import { useQueryState } from 'next-usequerystate';

import { Category } from '@/interfaces';
import { selectCategory, setCategory } from '@/redux/features/categoriesSlice';
import { getPostsByCategory } from '@/redux/features/postsSlice';
import { capitalize } from '@/utils/capitalize';

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

    const [categoryType, setCategoryType] = useQueryState('category');
    
    useEffect(() => {
        if (categories.length) {
            if (categoryType) {
                // Find the category by type. This happens when the user selects a category or if a link with a category is visited
                const category = categories.find((item: Category) => item.name.toLowerCase() === categoryType.toLowerCase())!;
                dispatch(setCategory(category));
                dispatch(getPostsByCategory(category._id!));
            } else {
                // Select the first category. This happens on page load
                const category = categories[0];
                dispatch(setCategory(category));
                dispatch(getPostsByCategory(category._id!));
            }
        }
    }, [categories, dispatch, categoryType, setCategoryType]);

    return (
        <Stack direction="row" spacing={1} className={classes.root}>
            {categories.map((category: Category) => (
                <Chip 
                    key={category._id} 
                    label={capitalize(category.name)} 
                    variant="filled" 
                    onClick={() => {
                        setCategoryType(category.name.toLowerCase());
                    }}
                    color={category._id === selectedCategory._id ? 'secondary' : 'default'}
                />
            ))}
        </Stack>
    );
};

export default Categories;