export const getFileNameExtension = (filename: string): string => {
    const fileNameArray = filename.split('.');
    const fileNameExtension = fileNameArray[fileNameArray.length - 1];
    return fileNameExtension
};