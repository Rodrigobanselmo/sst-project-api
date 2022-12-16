import { Injectable } from '@nestjs/common';

import { RiskRepository } from '../../../repositories/implementations/RiskRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { FindRiskDto } from '../../../dto/risk.dto';

@Injectable()
export class FindRiskByIdService {
  constructor(private readonly riskRepository: RiskRepository) {}

  async execute(id: string, user: UserPayloadDto) {
    const companyId = user.targetCompanyId;

    const risks = await this.riskRepository.findOneById(id, companyId);

    return risks;
  }
}
