import { DomainResponse } from '@/@v2/shared/domain/types/shared/domain-response';
import { FileEntity } from '../../domain/entities/file.entity';

export namespace IReadManyFileService {
  export type Params = {
    fileIds: string[];
    companyId: string;
  };

  export type Result = Promise<DomainResponse<FileEntity[]>>;
}
