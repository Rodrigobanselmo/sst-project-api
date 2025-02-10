import { Inject, Injectable } from '@nestjs/common';

import { IStorageAdapter } from '@/@v2/shared/adapters/storage/storage.interface';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { FileRepository } from '../../database/repositories/file/file.repository';
import { FileEntity } from '../../domain/entities/file.entity';
import { IAddFileService } from './add-file.interface';

@Injectable()
export class AddFileService {
  constructor(
    @Inject(SharedTokens.Storage)
    private readonly storage: IStorageAdapter,
    private readonly fileRepository: FileRepository,
  ) {}

  async add(params: IAddFileService.Params): IAddFileService.Result {
    const { url, key, bucket } = await this.storage.upload({
      file: params.buffer,
      fileFolder: params.fileFolder.replace(':companyId', params.companyId),
      fileName: params.fileName,
    });

    const document = new FileEntity({
      bucket,
      url,
      key,
      name: params.fileName,
      companyId: params.companyId,
      shouldDelete: params.shouldDelete,
      size: params.size,
    });

    const file = await this.fileRepository.create(document);
    return [file, null];
  }
}
