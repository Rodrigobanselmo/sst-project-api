import { Injectable, NotFoundException } from '@nestjs/common';
import { RiskRepository } from '../../../repositories/implementations/RiskRepository';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { isMaster } from '../../../../../shared/utils/isMater';
import { RiskFactorsEntity } from '../../../../../modules/checklist/entities/risk.entity';

@Injectable()
export class DeleteSoftRiskService {
  constructor(private readonly riskRepository: RiskRepository) {}

  async execute(id: string, userPayloadDto: UserPayloadDto) {
    const user = isMaster(userPayloadDto);
    const companyId = user.companyId;

    let risk: RiskFactorsEntity;
    if (user.isMaster) {
      risk = await this.riskRepository.DeleteByIdSoft(id);
    } else {
      risk = await this.riskRepository.DeleteByCompanyAndIdSoft(id, companyId);
    }

    if (!risk.id) throw new NotFoundException('data not found');

    return risk;
  }
}
