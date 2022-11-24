import { ProtocolToRiskRepository } from './../../../repositories/implementations/ProtocolRiskRepository';
import { CreateProtocolToRiskDto } from './../../../dto/protocol-to-risk.dto';
import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';

@Injectable()
export class CreateProtocolToRiskService {
  constructor(private readonly protocolToRiskRepository: ProtocolToRiskRepository) {}

  async execute(createExamDto: CreateProtocolToRiskDto, user: UserPayloadDto) {
    const ExamFactor = await this.protocolToRiskRepository.create({
      ...createExamDto,
      companyId: user.targetCompanyId,
    });

    return ExamFactor;
  }
}
