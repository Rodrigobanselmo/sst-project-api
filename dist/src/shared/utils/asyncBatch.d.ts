export declare function asyncBatch<T, S>(array: T[], perChunk: number, callbackFn: (value: T, index?: number) => Promise<S>): Promise<S[]>;
