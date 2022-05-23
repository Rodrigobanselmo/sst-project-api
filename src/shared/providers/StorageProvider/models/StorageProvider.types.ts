import internal, { Readable } from 'stream';

interface IStorageProvider {
  upload(params: FileStorage.Upload.Params): Promise<FileStorage.Upload.Result>;
  delete(params: FileStorage.Delete.Params): Promise<FileStorage.Delete.Result>;
}

export namespace FileStorage {
  export namespace Upload {
    export type Params = {
      file: Readable;
      fileName: string;
    };

    export type Result = {
      url: string;
    };
  }

  export namespace Download {
    export type Params = {
      fileKey: string;
    };

    export type Result = {
      file: internal.Readable;
    };
  }

  export namespace Delete {
    export type Params = {
      fileName: string;
    };

    export type Result = void;
  }
}

export { IStorageProvider };
