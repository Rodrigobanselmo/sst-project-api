

export namespace IDonwloadImage {
  export type Params = { imageUrl: string | null | undefined; }
  export type ParamsBatch<T, S> = {
    images: T[];
    getUrl: (image: T) => string | null;
    callbackFn: (path: string | null, value: T) => Promise<S>;
  }
}
