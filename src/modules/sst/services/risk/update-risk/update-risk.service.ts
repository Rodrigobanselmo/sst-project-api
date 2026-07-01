import { Injectable, NotFoundException } from '@nestjs/common';

import { assertCanUpdateRiskFactor } from '../../../shared/risk-factor-catalog-scope.util';
import { RiskSubTypeLinkValidator } from '../../../shared/risk-sub-type-link.validator';
import { UpdateRiskDto } from '../../../dto/risk.dto';
import { RiskRepository } from '../../../repositories/implementations/RiskRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';

@Injectable()
export class UpdateRiskService {
  constructor(
    private readonly riskRepository: RiskRepository,
    private readonly riskSubTypeLinkValidator: RiskSubTypeLinkValidator,
  ) {}

  async execute(id: string, updateRiskDto: UpdateRiskDto, user: UserPayloadDto) {
    const system = user.isSystem;
    const companyId = user.targetCompanyId;

    const existingRisk = await this.riskRepository.findOneById(id, companyId);
    assertCanUpdateRiskFactor(existingRisk, user);

    const riskType = updateRiskDto.type ?? existingRisk.type;

    await this.riskSubTypeLinkValidator.assertValidLinks(
      riskType,
      updateRiskDto.subTypesIds,
    );

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
