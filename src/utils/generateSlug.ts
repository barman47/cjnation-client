export const generateSlug = (text: string): string => {
    return text.split(' ').join('-');
};