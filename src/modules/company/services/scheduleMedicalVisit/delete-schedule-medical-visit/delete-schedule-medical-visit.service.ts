import { ScheduleMedicalVisitRepository } from './../../../repositories/implementations/ScheduleMedicalVisitRepository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorMessageEnum } from '../../../../../shared/constants/enum/errorMessage';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';

@Injectable()
export class DeleteScheduleMedicalVisitsService {
  constructor(private readonly scheduleMedicalVisitRepository: ScheduleMedicalVisitRepository) {}

  async execute(id: number, user: UserPayloadDto) {
    const found = await this.scheduleMedicalVisitRepository.findFirstNude({
      where: {
        id,
        companyId: user.targetCompanyId,
      },
    });

    if (!found?.id) throw new BadRequestException('não encontrado ou sem premissões de acesso');

    const contact = await this.scheduleMedicalVisitRepository.delete(id);

    return contact;
  }
}
