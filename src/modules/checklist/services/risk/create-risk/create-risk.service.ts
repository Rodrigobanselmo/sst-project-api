import { Injectable } from '@nestjs/common';
import { CreateRiskDto } from '../../../../../modules/checklist/dto/risk.dto';
import { RiskRepository } from '../../../../../modules/checklist/repositories/implementations/RiskRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';

@Injectable()
export class CreateRiskService {
  constructor(private readonly riskRepository: RiskRepository) {}

  async execute(createRiskDto: CreateRiskDto, user: UserPayloadDto) {
    const system = user.isSystem;

    const riskFactor = await this.riskRepository.create(createRiskDto, system);

    return riskFactor;
  }
}
