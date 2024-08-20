export type PromiseInfer<T> = T extends PromiseLike<infer U> ? U : T;
