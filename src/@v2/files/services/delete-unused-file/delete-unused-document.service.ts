import { Injectable } from '@nestjs/common';

import { asyncBatch } from '@/@v2/shared/utils/helpers/async-batch';
import { captureException } from '@/@v2/shared/utils/helpers/capture-exception';
import { FileRepository } from '../../database/repositories/file/file.repository';
import { IDeleteUnusedFileService } from './delete-unused-document.interface';

@Injectable()
export class DeleteUnusedFileService {
  constructor(private readonly fileRepository: FileRepository) {}

  async delete(): IDeleteUnusedFileService.Result {
    const files = await this.fileRepository.findManyUnused();

    asyncBatch({
      items: files,
      batchSize: 10,
      callback: async (file) => {
        try {
          await this.fileRepository.delete(file);
        } catch (error) {
          captureException({ error, extra: { file, action: 'delete unused document' } });
        }
      },
    });
  }
}
