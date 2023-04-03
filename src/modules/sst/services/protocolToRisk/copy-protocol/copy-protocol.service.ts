import { CopyProtocolToRiskDto } from './../../../dto/protocol-to-risk.dto';
import { ProtocolToRiskRepository } from './../../../repositories/implementations/ProtocolRiskRepository';
import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';

@Injectable()
export class CopyProtocolToRiskService {
  constructor(private readonly protocolToRiskRepository: ProtocolToRiskRepository) {}

  async execute(copyProtocolToRiskDto: CopyProtocolToRiskDto, user: UserPayloadDto) {
    const FromProtocolFactor = await this.protocolToRiskRepository.findNude({
      where: { companyId: copyProtocolToRiskDto.fromCompanyId, riskId: { not: null } },
    });

    const ActualProtocolFactor = await this.protocolToRiskRepository.findNude({
      where: { companyId: user.targetCompanyId },
      select: { riskId: true, protocolId: true },
    });

    const copyData = FromProtocolFactor.map((protocol) => {
      const found = ActualProtocolFactor.find((aProtocol) => aProtocol.protocolId === protocol.protocolId && aProtocol.riskId === protocol.riskId);

      if (found) return null;

      return protocol;
    }).filter((i) => i);

    const ProtocolFactor = await this.protocolToRiskRepository.createMany({
      data: copyData,
      companyId: user.targetCompanyId,
    });

    return ProtocolFactor;
  }
}
