import { Inject, Injectable } from '@nestjs/common';

import { IStorageAdapter } from '@/@v2/shared/adapters/storage/storage.interface';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { FileRepository } from '../../database/repositories/file/file.repository';
import { FileEntity } from '../../domain/entities/file.entity';
import { IAddFileService } from './add-file.interface';
import { getFileName } from '@/@v2/shared/utils/file/get-file-name';

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
      fileName: getFileName(params.fileName),
      isPublic: params.isPublic,
    });

    const document = new FileEntity({
      bucket,
      url,
      key,
      name: params.fileName,
      companyId: params.companyId,
      shouldDelete: params.shouldDelete,
      size: params.size,
      metadata: params.metadata,
    });

    const file = await this.fileRepository.create(document);

    if (!file) throw new Error('Não foi possível adicionar o arquivo');

    return [file, null];
  }
}
