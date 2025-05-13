import { DocumentControlFileRepository } from '@/@v2/enterprise/document-control/database/repositories/document-control-file/document-control-file.repository';
import { DocumentControlFileEntity } from '@/@v2/enterprise/document-control/domain/entities/document-control-file.entity';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { IFileRequester } from '@/@v2/shared/requesters/files/file.interface';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IDocumentControlUseCase } from './edit-document-control-file.types';

@Injectable()
export class EditDocumentControlFileUseCase {
  constructor(
    @Inject(SharedTokens.FileRequester)
    private readonly fileRequester: IFileRequester,
    private readonly documentControlFileRepository: DocumentControlFileRepository,
  ) {}

  async execute(params: IDocumentControlUseCase.Params) {
    const documentControlFile = await this.documentControlFileRepository.find({
      id: params.documentControlFileId,
      companyId: params.companyId,
    });

    if (!documentControlFile) throw new BadRequestException('Documento não encontrado');

    await this.addFile(params, documentControlFile);

    documentControlFile.update(params);

    await this.documentControlFileRepository.update(documentControlFile);
  }

  private async addFile(params: IDocumentControlUseCase.Params, documentControlFile: DocumentControlFileEntity) {
    if (!params.fileId) return;

    const [file, error] = await this.fileRequester.read({
      fileId: params.fileId!,
      companyId: params.companyId,
    });

    if (error) throw new BadRequestException(error.message);
    if (!file) throw new BadRequestException('Arquivo não encontrado');

    documentControlFile.file = file;
  }
}
