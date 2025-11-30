export namespace IDownloadImage {
  export type DownloadParams = { imageUrl: string | null | undefined };
  export type DownloadBatchParams<T, S> = {
    images: T[];
    getUrl: (image: T) => string | null;
    callbackFn: (path: string | null, value: T) => Promise<S>;
  };
}
