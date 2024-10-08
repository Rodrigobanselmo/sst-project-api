import { Injectable } from '@nestjs/common';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { RiskRepository } from '../../../repositories/implementations/RiskRepository';

@Injectable()
export class FindAllAvailableRiskService {
  constructor(private readonly riskRepository: RiskRepository) {}

  async execute(userPayloadDto: UserPayloadDto) {
    const ChecklistFactor = await this.riskRepository.findAllAvailable(userPayloadDto.companyId);

    return ChecklistFactor.map((risk) => {
      Object.entries(risk).forEach(([key, value]) => {
        if (value == '' || value == null) delete risk[key];
      });

      return risk;
    });
  }
}
