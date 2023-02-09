import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRiskDto } from '../../../dto/risk.dto';
import { RiskRepository } from '../../../repositories/implementations/RiskRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';

@Injectable()
export class CreateRiskService {
  constructor(private readonly riskRepository: RiskRepository) {}

  async execute(createRiskDto: CreateRiskDto, user: UserPayloadDto) {
    const system = user.isSystem;

    const found = await this.riskRepository.findNude({ where: { name: createRiskDto.name, companyId: user.targetCompanyId }, select: { id: true } });
    if (found.length > 0) throw new BadRequestException('Risco com esse nome já existente');
    const riskFactor = await this.riskRepository.create(createRiskDto, system);

    return riskFactor;
  }
}
