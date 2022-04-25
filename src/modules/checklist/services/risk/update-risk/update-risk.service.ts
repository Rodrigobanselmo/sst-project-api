import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateRiskDto } from '../../../../../modules/checklist/dto/risk.dto';
import { RiskRepository } from '../../../../../modules/checklist/repositories/implementations/RiskRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';

@Injectable()
export class UpdateRiskService {
  constructor(private readonly riskRepository: RiskRepository) {}

  async execute(
    id: string,
    updateRiskDto: UpdateRiskDto,
    user: UserPayloadDto,
  ) {
    const system = user.isMaster;
    const companyId = user.targetCompanyId;

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
