import { Injectable } from '@nestjs/common';

import { FileRepository } from '../../database/repositories/file/file.repository';
import { errorFileNotFound } from '../../domain/errors/file.errors';
import { IReadFileService } from './read-file.interface';

@Injectable()
export class ReadFileService {
  constructor(private readonly fileRepository: FileRepository) {}

  async read(params: IReadFileService.Params): IReadFileService.Result {
    const document = await this.fileRepository.find({
      id: params.fileId,
      companyId: params.companyId,
    });

    if (!document) return [, errorFileNotFound];
    return [document, null];
  }
}
