import { Injectable, NotFoundException } from '@nestjs/common';

import { assertCanUpdateRiskFactor } from '../../../shared/risk-factor-catalog-scope.util';
import { UpdateRiskDto } from '../../../dto/risk.dto';
import { RiskRepository } from '../../../repositories/implementations/RiskRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';

@Injectable()
export class UpdateRiskService {
  constructor(private readonly riskRepository: RiskRepository) {}

  async execute(id: string, updateRiskDto: UpdateRiskDto, user: UserPayloadDto) {
    const system = user.isSystem;
    const companyId = user.targetCompanyId;

    const existingRisk = await this.riskRepository.findOneById(id, companyId);
    assertCanUpdateRiskFactor(existingRisk, user);

    const risk = await this.riskRepository.update(
      {
        id,
        ...updateRiskDto,
      },
      system,
      companyId,
    );

    if (!risk.id) throw new NotFoundException('risk not found');

    return risk;
  }
}
