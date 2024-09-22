export function asc(a, b) {
    return a === b ? 0 : a > b ? 1 : -1;
}

export function desc(a, b) {
    return a === b ? 0 : a > b ? -1 : 1;
}
