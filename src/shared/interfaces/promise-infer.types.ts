/**
 * @deprecated - Use from backend v2
 */
export type PromiseInfer<T> = T extends PromiseLike<infer U> ? U : T;
