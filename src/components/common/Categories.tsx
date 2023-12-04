'use client';

import { useEffect } from 'react';
import { AppDispatch } from '@/redux/store';
import { 
    Chip,
    Stack,
    Theme
 } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from 'tss-react/mui';

import { Category } from '@/interfaces';
import { selectCategory, setCategory } from '@/redux/features/categoriesSlice';
import { getPostsByCategory } from '@/redux/features/postsSlice';
import { capitalize } from '@/utils/capitalize';
import { useSearchParams } from 'next/navigation';

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
    const searchParams = useSearchParams();
    
    const selectedCategory = useSelector(selectCategory);

    useEffect(() => {
        const categoryType = searchParams.get('category');
        // Get the data when the user opens the page with existing search parameter
        if (categoryType) {
            const category = categories.find((item: Category) => item.name.toLowerCase() === categoryType.toLowerCase())!;
            dispatch(setCategory(category));
            dispatch(getPostsByCategory(category._id!));
        } else {
            // Select the first category since none exists in the url
            const category = categories[0];
            handleSetCategory(category);
        }
        // eslint-disable-next-line
    }, []);

    const handleSetCategory = (category: Category): void => {
        window.history.pushState({}, '', `?category=${category.name.toLowerCase()}`);
        dispatch(setCategory(category));
        dispatch(getPostsByCategory(category._id!));
    };

    return (
        <Stack direction="row" spacing={1} className={classes.root}>
            {categories.map((category: Category) => (
                <Chip 
                    key={category._id} 
                    label={capitalize(category.name)} 
                    variant="filled" 
                    onClick={() => handleSetCategory(category)}
                    color={category._id === selectedCategory._id ? 'secondary' : 'default'}
                />
            ))}
        </Stack>
    );
};

export default Categories;