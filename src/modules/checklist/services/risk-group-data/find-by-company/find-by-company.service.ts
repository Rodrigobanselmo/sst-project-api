import { Injectable } from '@nestjs/common';
import { RiskGroupDataRepository } from '../../../repositories/implementations/RiskGroupDataRepository';

@Injectable()
export class FindAllByCompanyService {
  constructor(
    private readonly riskGroupDataRepository: RiskGroupDataRepository,
  ) {}

  async execute(companyId: string, workspaceId: string) {
    const riskGroupData = await this.riskGroupDataRepository.findAllByCompany(
      companyId,
      workspaceId,
    );

    return riskGroupData;
  }
}
