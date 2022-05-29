/// <reference types="node" />
import internal, { Readable } from 'stream';
interface IStorageProvider {
    upload(params: FileStorage.Upload.Params): Promise<FileStorage.Upload.Result>;
    delete(params: FileStorage.Delete.Params): Promise<FileStorage.Delete.Result>;
}
export declare namespace FileStorage {
    namespace Upload {
        type Params = {
            file: Readable;
            fileName: string;
        };
        type Result = {
            url: string;
        };
    }
    namespace Download {
        type Params = {
            fileKey: string;
        };
        type Result = {
            file: internal.Readable;
        };
    }
    namespace Delete {
        type Params = {
            fileName: string;
        };
        type Result = void;
    }
}
export { IStorageProvider };
