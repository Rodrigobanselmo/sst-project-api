import { UpdateProtocolDto } from '../../../dto/protocol.dto';
import { ProtocolRepository } from '../../../repositories/implementations/ProtocolRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UpdateProtocolsService {
  constructor(private readonly protocolRepository: ProtocolRepository) {}

  async execute(UpsertProtocolsDto: UpdateProtocolDto, user: UserPayloadDto) {
    const protocol = await this.protocolRepository.update({
      ...UpsertProtocolsDto,
      companyId: user.targetCompanyId,
    });

    return protocol;
  }
}
