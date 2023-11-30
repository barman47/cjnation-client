function debounce<T extends (...args: any[]) => void>(func: T, delay: number) {
    let timer: NodeJS.Timeout;
    return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

export default debounce;