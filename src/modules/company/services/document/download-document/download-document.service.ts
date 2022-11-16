import { AmazonStorageProvider } from './../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorMessageEnum } from '../../../../../shared/constants/enum/errorMessage';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { DocumentRepository } from '../../../repositories/implementations/DocumentRepository';

@Injectable()
export class DownloadDocumentService {
  constructor(private readonly documentRepository: DocumentRepository, private readonly amazonStorageProvider: AmazonStorageProvider) {}

  async execute(id: number, user: UserPayloadDto) {
    const companyId = user.targetCompanyId;
    const documentFound = await this.documentRepository.findFirstNude({
      where: {
        id,
        companyId,
      },
      select: { id: true, fileUrl: true },
    });

    if (!documentFound?.id) throw new BadRequestException(ErrorMessageEnum.DOCUMENT_NOT_FOUND);

    const fileKey = documentFound.fileUrl.split('.com/').pop();
    const { file: fileStream } = this.amazonStorageProvider.download({
      fileKey,
    });

    return { fileStream, fileKey };
  }
}
