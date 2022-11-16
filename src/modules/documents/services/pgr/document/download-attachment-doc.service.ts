import { BadRequestException, Injectable } from '@nestjs/common';
import { RiskDocumentRepository } from '../../../../sst/repositories/implementations/RiskDocumentRepository';
import { AmazonStorageProvider } from '../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ErrorDocumentEnum } from '../../../../../shared/constants/enum/errorMessage';

@Injectable()
export class DownloadAttachmentsService {
  constructor(private readonly amazonStorageProvider: AmazonStorageProvider, private readonly riskDocumentRepository: RiskDocumentRepository) {}
  async execute(userPayloadDto: UserPayloadDto, docId: string, attachmentId: string) {
    const companyId = userPayloadDto.targetCompanyId;

    const riskDoc = await this.riskDocumentRepository.findById(docId, companyId, { include: { attachments: true } });
    if (!riskDoc?.id) throw new BadRequestException(ErrorDocumentEnum.NOT_FOUND);

    const attachment = riskDoc.attachments.find((attachment) => attachment.id === attachmentId);
    if (!attachment?.id) throw new BadRequestException(ErrorDocumentEnum.NOT_FOUND);

    const fileKey = attachment.url.split('.com/').pop();

    const { file: fileStream } = this.amazonStorageProvider.download({
      fileKey,
    });

    return { fileStream, fileKey };
  }
}
