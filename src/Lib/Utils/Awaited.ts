/**
 * ReturnType for a function that can return either a value or a `Promise` with that value
 */
export type Awaited<T> = PromiseLike<T> | T;
