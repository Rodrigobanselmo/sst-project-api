import { Injectable } from '@nestjs/common';
import { RiskRepository } from '../../../../../modules/checklist/repositories/implementations/RiskRepository';

@Injectable()
export class FindAllAvailableRiskService {
  constructor(private readonly riskRepository: RiskRepository) {}

  async execute(companyId: string) {
    const ChecklistFactor = await this.riskRepository.findAllAvailable(
      companyId,
      {
        include: { recMed: true, generateSource: true, adms: true },
      },
    );

    return ChecklistFactor;
  }
}
