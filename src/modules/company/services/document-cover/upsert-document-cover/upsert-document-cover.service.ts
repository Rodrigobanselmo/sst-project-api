import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { AmazonStorageProvider } from '../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { DocumentCoverRepository } from '../../../repositories/implementations/DocumentCoverRepository';
import { CreateDocumentCoverDto, UpdateDocumentCoverDto } from '../../../dto/document-cover.dto';
import { DocumentCoverEntity } from '../../../entities/document-cover.entity';

@Injectable()
export class UpsertDocumentCoverService {
  constructor(
    private readonly documentCoverRepository: DocumentCoverRepository,
    private readonly amazonStorageProvider: AmazonStorageProvider,
  ) {}

  async execute(
    data: CreateDocumentCoverDto & { id?: number },
    userPayloadDto: UserPayloadDto,
    file?: any,
  ): Promise<DocumentCoverEntity> {
    const companyId = userPayloadDto.targetCompanyId;

    let backgroundImagePath = data.json?.coverProps?.backgroundImagePath;

    // If file is provided, upload to S3
    if (file) {
      backgroundImagePath = await this.upload(companyId, file);
    }

    // Update the json with the new backgroundImagePath if changed
    const json = {
      coverProps: {
        ...(data.json?.coverProps || {}),
        ...(backgroundImagePath && { backgroundImagePath }),
      },
    };

    const documentCover = await this.documentCoverRepository.upsert(companyId, {
      ...data,
      json,
    });

    return documentCover;
  }

  private async upload(companyId: string, file: any): Promise<string> {
    const fileType = file.originalname.split('.').pop();
    const path = `cover/${companyId}/${v4()}.${fileType}`;

    const { url } = await this.amazonStorageProvider.upload({
      file: file.buffer,
      isPublic: true,
      fileName: path,
    });

    return url;
  }
}

