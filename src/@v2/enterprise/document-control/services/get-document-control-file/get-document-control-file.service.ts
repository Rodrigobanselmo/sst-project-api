import { DocumentControlFileEntity } from '@/@v2/enterprise/document-control/domain/entities/document-control-file.entity';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { IFileRequester } from '@/@v2/shared/requesters/files/file.interface';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IDocumentControlFileService } from './get-document-control-file.types';

@Injectable()
export class GetDocumentControlFileService {
  constructor(
    @Inject(SharedTokens.FileRequester)
    private readonly fileRequester: IFileRequester,
  ) {}

  async get(params: IDocumentControlFileService.Params) {
    const [file, error] = await this.fileRequester.read({
      fileId: params.fileId,
      companyId: params.companyId,
    });

    if (error) throw new BadRequestException(error.message);
    if (!file) throw new BadRequestException('Arquivo não encontrado');

    const documentFile = new DocumentControlFileEntity({
      companyId: params.companyId,
      documentControlId: params.documentControlId,
      endDate: params.endDate || null,
      file,
      description: params.description,
      name: file.name,
      startDate: params.startDate || null,
    });

    return documentFile;
  }
}
