import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { UpdateProtocolRiskDto } from '../../../dto/protocol.dto';
import { ProtocolRepository } from '../../../repositories/implementations/ProtocolRepository';

@Injectable()
export class UpdateRiskProtocolsService {
  constructor(private readonly protocolRepository: ProtocolRepository) {}

  async execute(UpsertProtocolsDto: UpdateProtocolRiskDto, user: UserPayloadDto) {
    const protocol = await this.protocolRepository.updateProtocolRiskREMOVE({
      ...UpsertProtocolsDto,
      companyId: user.targetCompanyId,
    });

    return protocol;
  }
}
