import { BUCKET_FOLDERS } from '@/@v2/shared/constants/buckets';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { IFileRequester } from '@/@v2/shared/requesters/files/file.interface';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IUseCase } from './add-document-control-system-file.types';

@Injectable()
export class AddFileUseCase {
  constructor(
    @Inject(SharedTokens.FileRequester)
    private readonly fileRequester: IFileRequester,
  ) {}

  async execute(params: IUseCase.Params) {
    const [file, error] = await this.fileRequester.add({
      buffer: params.buffer,
      fileName: params.name,
      companyId: params.companyId,
      fileFolder: BUCKET_FOLDERS.DOCUMENT_CONTROL,
      shouldDelete: true,
      size: params.size,
    });

    if (error || !file) throw new BadRequestException('Não foi possível adicionar o arquivo');

    return file;
  }
}
