import { AmazonStorageProvider } from './../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorMessageEnum } from '../../../../../shared/constants/enum/errorMessage';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { DocumentRepository } from '../../../repositories/implementations/DocumentRepository';

@Injectable()
export class DeleteDocumentService {
  constructor(
    private readonly documentRepository: DocumentRepository,
    private readonly amazonStorageProvider: AmazonStorageProvider,
  ) {}

  async execute(id: number, user: UserPayloadDto) {
    const documentFound = await this.documentRepository.findFirstNude({
      where: {
        id,
        companyId: user.targetCompanyId,
      },
      select: { id: true, oldDocuments: { select: { _count: true }, take: 1 } },
    });

    if (!documentFound?.id) throw new BadRequestException(ErrorMessageEnum.DOCUMENT_NOT_FOUND);
    if (!documentFound?.parentDocumentId && documentFound?.oldDocuments && documentFound.oldDocuments.length != 0)
      throw new BadRequestException(ErrorMessageEnum.DOCUMENT_IS_PRINCIPAL);

    if (documentFound?.fileUrl) {
      const splitUrl = documentFound.fileUrl.split('.com/');

      await this.amazonStorageProvider.delete({
        fileName: splitUrl[splitUrl.length - 1],
      });
    }

    const document = await this.documentRepository.delete(id, user.targetCompanyId);

    return document;
  }
}
