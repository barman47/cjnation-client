export const removeHtmlTags = (text: string): string => text.replace(/<[^>]*>/g, '');