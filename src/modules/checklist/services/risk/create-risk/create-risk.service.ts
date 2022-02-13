import { Injectable } from '@nestjs/common';
import { CreateRiskDto } from 'src/modules/checklist/dto/create-risk.dto';
import { RiskRepository } from 'src/modules/checklist/repositories/implementations/RiskRepository';
import { UserPayloadDto } from 'src/shared/dto/user-payload.dto';
import { isMaster } from 'src/shared/utils/isMater';

@Injectable()
export class CreateRiskService {
  constructor(private readonly riskRepository: RiskRepository) {}

  async execute(createRiskDto: CreateRiskDto, userPayloadDto: UserPayloadDto) {
    const user = isMaster(userPayloadDto);

    const system = user.isMaster && user.companyId === createRiskDto.companyId;

    const riskFactor = await this.riskRepository.create(createRiskDto, system);

    return riskFactor;
  }
}
