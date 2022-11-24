import { FileStorage, IStorageProvider } from '../../models/StorageProvider.types';
export declare class AmazonStorageProvider implements IStorageProvider {
    private readonly s3;
    private readonly bucket;
    constructor();
    upload({ file, fileName, isPublic }: FileStorage.Upload.Params): Promise<FileStorage.Upload.Result>;
    uploadLarge({ file, fileName, isPublic }: FileStorage.Upload.Params): Promise<FileStorage.Upload.Result>;
    download({ fileKey }: FileStorage.Download.Params): FileStorage.Download.Result;
    delete({ fileName }: FileStorage.Delete.Params): Promise<FileStorage.Delete.Result>;
    private contentType;
}
