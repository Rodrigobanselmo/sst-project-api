import { Injectable, NotFoundException } from '@nestjs/common';
import { RecMedRepository } from '../../../repositories/implementations/RecMedRepository';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { isMaster } from '../../../../../shared/utils/isMater';

@Injectable()
export class DeleteSoftRecMedService {
  constructor(private readonly recMedRepository: RecMedRepository) {}

  async execute(id: string, userPayloadDto: UserPayloadDto) {
    const user = isMaster(userPayloadDto);
    const companyId = user.companyId;

    const recMed = await this.recMedRepository.DeleteByIdSoft(id, companyId);

    if (!recMed.id) throw new NotFoundException('data not found');

    return recMed;
  }
}
