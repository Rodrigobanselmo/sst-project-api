import { CoverModel } from '@/@v2/documents/domain/models/cover.model';
import { IUnlinkPaths } from '@/@v2/documents/factories/document/types/document-factory.types';

export namespace IDownloadImage {
  export type DownloadParams = { imageUrl: string | null | undefined };
  export type DownloadBatchParams<T, S> = {
    images: T[];
    getUrl: (image: T) => string | null;
    callbackFn: (path: string | null, value: T) => Promise<S>;
  };
  export type DownloadCoverImagesParams = {
    covers: CoverModel[];
    unlinkPaths: IUnlinkPaths[];
  };
}
