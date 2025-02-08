import { DomainResponse } from '@/@v2/shared/domain/types/shared/domain-response';
import { FileEntity } from '../../domain/entities/file.entity';

export namespace IAddFileService {
  export type Params = {
    fileName: string;
    fileFolder: string;
    buffer: Buffer;
    companyId: string;
    shouldDelete?: boolean;
    bucket?: string;
  };

  export type Result = Promise<DomainResponse<FileEntity>>;
}
