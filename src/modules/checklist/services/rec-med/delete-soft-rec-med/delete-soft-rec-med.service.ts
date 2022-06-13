import { Injectable, NotFoundException } from '@nestjs/common';
import { RecMedRepository } from '../../../repositories/implementations/RecMedRepository';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { isMaster } from '../../../../../shared/utils/isMater';
import { RecMedEntity } from 'src/modules/checklist/entities/recMed.entity';

@Injectable()
export class DeleteSoftRecMedService {
  constructor(private readonly recMedRepository: RecMedRepository) {}

  async execute(id: string, userPayloadDto: UserPayloadDto) {
    const user = isMaster(userPayloadDto);
    const companyId = user.companyId;

    let recMed: RecMedEntity;
    if (user.isMaster) {
      recMed = await this.recMedRepository.DeleteByIdSoft(id);
    } else {
      recMed = await this.recMedRepository.DeleteByCompanyAndIdSoft(
        id,
        companyId,
      );
    }

    if (!recMed.id) throw new NotFoundException('data not found');

    return recMed;
  }
}
