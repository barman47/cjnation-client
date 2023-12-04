'use client';

import { useEffect } from 'react';
import { 
    Chip,
    Stack,
    Theme
 } from '@mui/material';
import { useSelector } from 'react-redux';
import { makeStyles } from 'tss-react/mui';

import { Category } from '@/interfaces';
import { selectCategory } from '@/redux/features/categoriesSlice';
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
    searchParamName: string;
    setCategory: (category: Category) => void;
    getFunction: (categoryId: string) => void;
}

const Categories: React.FC<Props> = ({ categories, getFunction, setCategory, searchParamName }) => {
    const { classes } = useStyles();
    const searchParams = useSearchParams();
    
    const selectedCategory = useSelector(selectCategory);

    useEffect(() => {
        const categoryType = searchParams.get(searchParamName);
        // Get the data when the user opens the page with existing search parameter
        if (categories.length) { // this is to ensure it runs only when there are categories. Useful if the page is refreshed
            if (categoryType) {
                const category = categories.find((item: Category) => item.name.toLowerCase() === categoryType.toLowerCase())!;
                setCategory(category);
                getFunction(category._id!);
            } else {
                // Select the first category since none exists in the url
                const category = categories[0];
                handleSetCategory(category);
            }
        }
        // eslint-disable-next-line
    }, [categories]);

    const handleSetCategory = (category: Category): void => {
        window.history.pushState({}, '', `?${searchParamName}=${category.name.toLowerCase()}`);
        setCategory(category);
        getFunction(category._id!);
    };

    if (!categories.length) {
        return null;
    }

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