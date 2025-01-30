import internal from 'stream';

export interface IStorageAdapter {
  upload(params: IStorageAdapter.Upload.Params): Promise<IStorageAdapter.Upload.Result>;
  delete(params: IStorageAdapter.Delete.Params): Promise<IStorageAdapter.Delete.Result>;
  download(params: IStorageAdapter.Download.Params): Promise<IStorageAdapter.Download.Result>;
}

export namespace IStorageAdapter {
  export namespace Upload {
    export type Params = {
      file: Buffer;
      fileKey: string;
      bucket?: string;
      isPublic?: boolean;
    };

    export type Result = {
      url: string;
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
}
