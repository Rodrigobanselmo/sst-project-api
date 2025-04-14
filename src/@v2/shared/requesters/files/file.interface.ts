import { DomainResponse } from '../../domain/types/shared/domain-response';
import { SystemFile } from '../../domain/types/shared/system-file';

export interface IFileRequester {
  read(params: IFileRequester.Read.Params): IFileRequester.Read.Result;
  add(params: IFileRequester.Add.Params): IFileRequester.Add.Result;
}

export namespace IFileRequester {
  export namespace Add {
    export type Params = {
      fileName: string;
      fileFolder: string;
      buffer: Buffer;
      companyId: string;
      shouldDelete?: boolean;
      bucket?: string;
      size: number;
      metadata?: Record<string, any>;
      isPublic?: boolean;
    };

    export type Result = Promise<DomainResponse<SystemFile>>;
  }

  export namespace Read {
    export type Params = { fileId: string; companyId: string };
    export type Result = Promise<DomainResponse<SystemFile>>;
  }
}
