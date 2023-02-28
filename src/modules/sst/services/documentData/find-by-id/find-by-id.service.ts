import { FindOneDocumentDataDto } from './../../../dto/document-data.dto';
import { Injectable } from '@nestjs/common';
import { DocumentDataRepository } from '../../../repositories/implementations/DocumentDataRepository';

@Injectable()
export class FindByIdDocumentDataService {
  constructor(private readonly documentDataRepository: DocumentDataRepository) {}

  async execute(query: FindOneDocumentDataDto, companyId: string) {
    const riskGroupData = await this.documentDataRepository.findOne(companyId, query.workspaceId, query.type);

    return riskGroupData;
  }
}
