import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { UpsertRiskDocInfoDto } from './../../../dto/risk-doc-info.dto';
import { RiskDocInfoRepository } from './../../../repositories/implementations/RiskDocInfoRepository';

@Injectable()
export class UpsertRiskDocInfoService {
  constructor(private readonly riskDocInfoRepository: RiskDocInfoRepository) {}

  async execute(upsertRiskDataDto: UpsertRiskDocInfoDto, user: UserPayloadDto) {
    const data = await this.riskDocInfoRepository.upsert({
      ...upsertRiskDataDto,
      companyId: user.targetCompanyId,
    });
    return data;
  }
}
