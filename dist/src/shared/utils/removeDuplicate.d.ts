interface IDuplicateOptions {
    simpleCompare?: boolean;
    removeById?: string;
}
export declare function removeDuplicate<T>(array: T[], options?: IDuplicateOptions): T[];
export {};
