import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CreateProtocolDto } from '../../../dto/protocol.dto';
import { ProtocolRepository } from '../../../repositories/implementations/ProtocolRepository';

@Injectable()
export class CreateProtocolsService {
  constructor(private readonly protocolRepository: ProtocolRepository) {}

  async execute(UpsertProtocolsDto: CreateProtocolDto, user: UserPayloadDto) {
    const protocol = await this.protocolRepository.create({
      ...UpsertProtocolsDto,
      companyId: user.targetCompanyId,
    });

    return protocol;
  }
}