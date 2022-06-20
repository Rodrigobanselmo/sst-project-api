import { BadRequestException, Injectable } from '@nestjs/common';
import { RiskDocumentRepository } from '../../../../checklist/repositories/implementations/RiskDocumentRepository';
import { AmazonStorageProvider } from '../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ErrorDocumentEnum } from '../../../../../shared/constants/enum/errorMessage';

@Injectable()
export class PgrDownloadService {
  constructor(
    private readonly amazonStorageProvider: AmazonStorageProvider,
    private readonly riskDocumentRepository: RiskDocumentRepository,
  ) {}
  async execute(userPayloadDto: UserPayloadDto, docId: string) {
    const companyId = userPayloadDto.targetCompanyId;

    const riskDoc = await this.riskDocumentRepository.findById(
      docId,
      companyId,
    );

    if (!riskDoc) throw new BadRequestException(ErrorDocumentEnum.NOT_FOUND);

    const fileKey = riskDoc.fileUrl.split('.com/').pop();

    const { file: fileStream } = this.amazonStorageProvider.download({
      fileKey,
    });

    return { fileStream, fileKey };
  }
}
