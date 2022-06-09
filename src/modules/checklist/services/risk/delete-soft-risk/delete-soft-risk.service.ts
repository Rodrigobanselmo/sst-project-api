import { Injectable, NotFoundException } from '@nestjs/common';
import { RiskRepository } from '../../../repositories/implementations/RiskRepository';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { isMaster } from '../../../../../shared/utils/isMater';

@Injectable()
export class DeleteSoftRiskService {
  constructor(private readonly riskRepository: RiskRepository) {}

  async execute(id: string, userPayloadDto: UserPayloadDto) {
    const user = isMaster(userPayloadDto);
    const companyId = user.companyId;

    const recMed = await this.riskRepository.DeleteByIdSoft(id, companyId);

    if (!recMed.id) throw new NotFoundException('data not found');

    return recMed;
  }
}
