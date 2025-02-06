import { DomainResponse } from '@/@v2/shared/domain/types/shared/domain-response';
import { FileEntity } from '../../domain/entities/file.entity';

export namespace IReadFileService {
  export type Params = {
    fileId: string;
    companyId: string;
  };

  export type Result = Promise<DomainResponse<FileEntity>>;
}
