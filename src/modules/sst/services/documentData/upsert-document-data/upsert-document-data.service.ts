import { UserPayloadDto } from './../../../../../shared/dto/user-payload.dto';
import { Injectable } from '@nestjs/common';

import { UpsertDocumentDataDto } from '../../../dto/document-data.dto';
import { DocumentDataRepository } from '../../../repositories/implementations/DocumentDataRepository';

@Injectable()
export class UpsertDocumentDataService {
  constructor(private readonly documentDataRepository: DocumentDataRepository) {}

  async execute(dto: UpsertDocumentDataDto & { json?: any }, user: UserPayloadDto) {
    const riskData = await this.documentDataRepository.upsert({ ...dto, companyId: user.targetCompanyId });
    return riskData;
  }
}
