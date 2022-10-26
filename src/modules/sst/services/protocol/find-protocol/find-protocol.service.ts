import { FindProtocolDto } from './../../../dto/protocol.dto';
import { ProtocolRepository } from '../../../repositories/implementations/ProtocolRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindProtocolsService {
  constructor(private readonly protocolRepository: ProtocolRepository) {}

  async execute(
    { skip, take, ...query }: FindProtocolDto,
    user: UserPayloadDto,
  ) {
    const access = await this.protocolRepository.find(
      { companyId: user.targetCompanyId, ...query },
      { skip, take },
    );

    return access;
  }
}
