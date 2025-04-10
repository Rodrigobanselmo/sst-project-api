import { Inject, Injectable } from '@nestjs/common';

import { IStorageAdapter } from '@/@v2/shared/adapters/storage/storage.interface';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { asyncBatch } from '@/@v2/shared/utils/helpers/async-batch';
import { FileRepository } from '../../database/repositories/file/file.repository';
import { IDeleteUnusedFileService } from './delete-unused-document.interface';
import { captureException } from '@/@v2/shared/utils/helpers/capture-exception';

@Injectable()
export class DeleteUnusedFileService {
  constructor(
    @Inject(SharedTokens.Storage)
    private readonly storage: IStorageAdapter,
    private readonly fileRepository: FileRepository,
  ) {}

  async delete(): IDeleteUnusedFileService.Result {
    const files = await this.fileRepository.findMany();

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
