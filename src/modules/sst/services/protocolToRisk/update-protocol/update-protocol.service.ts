import { UpdateProtocolToRiskDto } from './../../../dto/protocol-to-risk.dto';
import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ProtocolToRiskRepository } from './../../../repositories/implementations/ProtocolRiskRepository';

@Injectable()
export class UpdateProtocolToRiskService {
  constructor(private readonly protocolToRiskRepository: ProtocolToRiskRepository) {}

  async execute(id: number, updateDto: UpdateProtocolToRiskDto, user: UserPayloadDto) {
    const protocol = await this.protocolToRiskRepository.update({
      id,
      companyId: user.targetCompanyId,
      ...updateDto,
    });

    return protocol;
  }
}
