import slugify from 'slugify';

export const generateSlug = (text: string): string => {
    // Preserve only spaces, numbers, and letters
    const cleanedText = text.replace(/[^a-zA-Z0-9\s]/g, '');

    // Generate the slug from the cleaned text
    const slug = slugify(cleanedText).toLowerCase();

    return slug;
};