interface IChuckOptions {
    balanced: boolean;
}
export declare function arrayChunks<T>(array: T[], perChunk: number, options?: IChuckOptions): Array<T[]>;
export {};
