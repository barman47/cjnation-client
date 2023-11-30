export const getYearArray = (year: number): number[] => {
    const years = [];

    for (let i = new Date().getFullYear(); i >= year; i--) {
        years.push(i);
    }
    return years;
};