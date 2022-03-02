import { Injectable } from '@nestjs/common';
import { CreateRiskDto } from 'src/modules/checklist/dto/risk.dto';
import { RiskRepository } from 'src/modules/checklist/repositories/implementations/RiskRepository';
import { UserPayloadDto } from 'src/shared/dto/user-payload.dto';

@Injectable()
export class CreateRiskService {
  constructor(private readonly riskRepository: RiskRepository) {}

  async execute(createRiskDto: CreateRiskDto, user: UserPayloadDto) {
    const system = user.isMaster;

    const riskFactor = await this.riskRepository.create(createRiskDto, system);

    return riskFactor;
  }
}
