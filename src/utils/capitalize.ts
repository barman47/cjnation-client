export const capitalize = (text: string): string => {
    return text.toLowerCase().split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');
};