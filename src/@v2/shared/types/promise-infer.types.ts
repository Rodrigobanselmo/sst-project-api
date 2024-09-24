export type IPromiseInfer<T> = T extends PromiseLike<infer U> ? U : T;
