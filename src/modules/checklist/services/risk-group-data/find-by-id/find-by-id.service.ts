import { Injectable } from '@nestjs/common';
import { RiskGroupDataRepository } from '../../../repositories/implementations/RiskGroupDataRepository';

@Injectable()
export class FindByIdService {
  constructor(
    private readonly riskGroupDataRepository: RiskGroupDataRepository,
  ) {}

  async execute(id: string, companyId: string) {
    const riskGroupData = await this.riskGroupDataRepository.findById(
      id,
      companyId,
      { include: { professionals: true, users: true } },
    );

    return riskGroupData;
  }
}
