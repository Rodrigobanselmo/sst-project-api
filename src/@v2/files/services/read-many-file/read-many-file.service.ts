import { Injectable } from '@nestjs/common';

import { FileRepository } from '../../database/repositories/file/file.repository';
import { IReadManyFileService } from './read-many-file.interface';

@Injectable()
export class ReadManyFileService {
  constructor(private readonly fileRepository: FileRepository) {}

  async read(params: IReadManyFileService.Params): IReadManyFileService.Result {
    const documents = await this.fileRepository.findMany({
      ids: params.fileIds,
      companyId: params.companyId,
    });

    return [documents, null];
  }
}
