export const setQueryParams = (queryName: string, queryValue: string) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set(queryName, queryValue);
    const usrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.pushState({}, '', usrl);
};