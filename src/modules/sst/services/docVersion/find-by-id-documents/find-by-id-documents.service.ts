import { Injectable } from '@nestjs/common';
import { RiskDocumentRepository } from '../../../repositories/implementations/RiskDocumentRepository';

@Injectable()
export class FindByIdDocumentsService {
  constructor(private readonly riskDocumentRepository: RiskDocumentRepository) {}

  async execute(id: string, companyId: string) {
    const riskGroupData = await this.riskDocumentRepository.findById(id, companyId, { include: { attachments: true } });

    return riskGroupData;
  }
}
