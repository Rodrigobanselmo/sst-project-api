import { Injectable } from '@nestjs/common';
import { RiskDocumentRepository } from '../../../repositories/implementations/RiskDocumentRepository';

@Injectable()
export class FindDocumentsService {
  constructor(
    private readonly riskDocumentRepository: RiskDocumentRepository,
  ) {}

  async execute(riskGroupId: string, companyId: string) {
    const riskGroupData =
      await this.riskDocumentRepository.findByRiskGroupAndCompany(
        riskGroupId,
        companyId,
      );

    return riskGroupData;
  }
}
