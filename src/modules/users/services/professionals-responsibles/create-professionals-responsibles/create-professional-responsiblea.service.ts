import { ProfessionalResponsibleRepository } from '../../../repositories/implementations/ProfessionalResponsibleRepository';
import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CreateProfessionalResponsibleDto } from '../../../dto/professional-responsible.dto';

@Injectable()
export class CreateProfessionalResponsibleService {
  constructor(private readonly professionalResponsibleRepository: ProfessionalResponsibleRepository) {}

  async execute(UpsertProfessionalResponsibleDto: CreateProfessionalResponsibleDto, user: UserPayloadDto) {
    const professionalResponsible = await this.professionalResponsibleRepository.create({
      ...UpsertProfessionalResponsibleDto,
      companyId: user.targetCompanyId,
    });

    return professionalResponsible;
  }
}
