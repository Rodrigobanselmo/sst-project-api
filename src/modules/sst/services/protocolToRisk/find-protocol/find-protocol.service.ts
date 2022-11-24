import { FindProtocolToRiskDto } from './../../../dto/protocol-to-risk.dto';
import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ProtocolToRiskRepository } from './../../../repositories/implementations/ProtocolRiskRepository';

@Injectable()
export class FindProtocolToRiskService {
  constructor(private readonly protocolToRiskRepository: ProtocolToRiskRepository) {}

  async execute({ skip, take, ...query }: FindProtocolToRiskDto, user: UserPayloadDto) {
    const ProtocolToRisk = await this.protocolToRiskRepository.find(
      { companyId: user.targetCompanyId, ...query },
      { skip, take },
      {
        include: {
          protocol: { select: { name: true, id: true } },
          risk: { select: { name: true, id: true, type: true } },
        },
      },
    );

    return ProtocolToRisk;
  }
}
