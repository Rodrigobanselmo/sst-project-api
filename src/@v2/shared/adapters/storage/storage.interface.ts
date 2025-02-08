import internal from 'stream';

export interface IStorageAdapter {
  upload(params: IStorageAdapter.Upload.Params): Promise<IStorageAdapter.Upload.Result>;
  delete(params: IStorageAdapter.Delete.Params): Promise<IStorageAdapter.Delete.Result>;
  download(params: IStorageAdapter.Download.Params): Promise<IStorageAdapter.Download.Result>;
  generateSignedPath(params: IStorageAdapter.GenerateSignPath.Params): Promise<IStorageAdapter.GenerateSignPath.Result>;
}

export namespace IStorageAdapter {
  export namespace Upload {
    export type Params = {
      file: Buffer;
      fileFolder: string;
      fileName: string;
      bucket?: string;
      isPublic?: boolean;
    };

    export type Result = {
      url: string;
      bucket: string;
      key: string;
    };
  }

  export namespace Download {
    export type Params = { fileKey: string; bucket?: string };

    export type Result = internal.Readable;
  }

  export namespace Delete {
    export type Params = { key: string; bucket?: string };

    export type Result = void;
  }

  export namespace GenerateSignPath {
    export type Params = {
      fileKey: string;
      expires?: number;
      bucket?: string;
    };

    export type Result = string;
  }
}
