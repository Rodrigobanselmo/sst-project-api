import { Injectable } from '@nestjs/common';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { RiskRepository } from '../../../../../modules/checklist/repositories/implementations/RiskRepository';

@Injectable()
export class FindAllAvailableRiskService {
  constructor(private readonly riskRepository: RiskRepository) {}

  async execute(userPayloadDto: UserPayloadDto) {
    const ChecklistFactor = await this.riskRepository.findAllAvailable(
      userPayloadDto.targetCompanyId,
      userPayloadDto.companyId,
      {
        include: {
          recMed: { where: { deleted_at: null } },
          generateSource: { where: { deleted_at: null } },
        },
      },
    );

    return ChecklistFactor;
  }
}
