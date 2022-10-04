import { ErrorMessageEnum } from 'src/shared/constants/enum/errorMessage';
import { AmazonStorageProvider } from './../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { BadRequestException, Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CreateDocumentDto } from '../../../dto/document.dto';
import { DocumentRepository } from '../../../repositories/implementations/DocumentRepository';
import { v4 } from 'uuid';
import dayjs from 'dayjs';

@Injectable()
export class CreateDocumentService {
  constructor(
    private readonly documentRepository: DocumentRepository,
    private readonly amazonStorageProvider: AmazonStorageProvider,
  ) {}

  async execute(
    { parentDocumentId, ...dto }: CreateDocumentDto,
    user: UserPayloadDto,
    file: Express.Multer.File,
  ) {
    const companyId = user.targetCompanyId;

    if (parentDocumentId) {
      const documentFound = await this.documentRepository.findFirstNude({
        where: {
          id: parentDocumentId,
          companyId,
        },
      });

      if (!documentFound?.id)
        throw new BadRequestException(ErrorMessageEnum.DOCUMENT_NOT_FOUND);

      const isNew = dto.endDate
        ? dayjs(documentFound.endDate).isBefore(dto.endDate)
        : false;

      const oldData = {
        companyId: user.targetCompanyId,
        fileUrl: documentFound.fileUrl,
        endDate: documentFound.endDate,
        startDate: documentFound.startDate,
        type: documentFound.type,
        name: documentFound.name,
        workspaceId: documentFound.workspaceId,
        status: documentFound.status,
        description: documentFound.description,
        parentDocumentId: documentFound.id,
      };

      if (isNew) {
        await this.documentRepository.create(oldData);

        let url: string;
        if (file) url = await this.upload(companyId, file, dto);

        const document = await this.documentRepository.update({
          ...dto,
          companyId: user.targetCompanyId,
          fileUrl: url,
          id: documentFound.id,
        });

        return document;
      }

      if (!isNew) {
        let url: string;
        if (file) url = await this.upload(companyId, file, dto);

        const document = await this.documentRepository.create({
          ...dto,
          companyId: user.targetCompanyId,
          fileUrl: url,
          parentDocumentId: documentFound.id,
        });

        return document;
      }
    }

    let url: string;
    if (file) url = await this.upload(companyId, file, dto);

    const document = await this.documentRepository.create({
      ...dto,
      companyId: user.targetCompanyId,
      fileUrl: url,
    });

    return document;
  }

  private async upload(
    companyId: string,
    file: Express.Multer.File,
    dto: CreateDocumentDto,
  ) {
    const fileType =
      file.originalname.split('.')[file.originalname.split('.').length - 1];
    const path =
      companyId + '/documents/' + `${dto?.name || ''}-${v4()}` + '.' + fileType;

    const { url } = await this.amazonStorageProvider.upload({
      file: file.buffer,
      fileName: path,
      // isPublic: true,
    });

    return url;
  }
}
