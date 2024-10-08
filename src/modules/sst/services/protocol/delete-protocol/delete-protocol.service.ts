import { isMaster } from './../../../../../shared/utils/isMater';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorMessageEnum } from '../../../../../shared/constants/enum/errorMessage';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ProtocolRepository } from '../../../repositories/implementations/ProtocolRepository';

@Injectable()
export class DeleteSoftProtocolsService {
  constructor(private readonly protocolRepository: ProtocolRepository) {}

  async execute(id: number, user: UserPayloadDto) {
    const userMain = isMaster(user);

    if (!userMain.isMaster) {
      const protocolFound = await this.protocolRepository.findFirstNude({
        where: {
          id,
          companyId: user.targetCompanyId,
        },
      });

      if (!protocolFound?.id) throw new BadRequestException(ErrorMessageEnum.PROTOCOL_NOT_FOUND);
    }

    const protocol = await this.protocolRepository.deleteSoft(id);

    return protocol;
  }
}
