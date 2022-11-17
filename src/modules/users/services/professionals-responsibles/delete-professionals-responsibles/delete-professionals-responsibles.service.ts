import { ProfessionalResponsibleRepository } from './../../../repositories/implementations/ProfessionalResponsibleRepository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorMessageEnum } from '../../../../../shared/constants/enum/errorMessage';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';

@Injectable()
export class DeleteProfessionalResponsibleService {
  constructor(private readonly professionalResponsibleRepository: ProfessionalResponsibleRepository) {}

  async execute(id: number, user: UserPayloadDto) {
    const professionalResponsibleFound = await this.professionalResponsibleRepository.findFirstNude({
      where: {
        id,
        companyId: user.targetCompanyId,
      },
    });

    if (!professionalResponsibleFound?.id) throw new BadRequestException(ErrorMessageEnum.PROFESSIONAL_NOT_FOUND);

    const professionalResponsible = await this.professionalResponsibleRepository.delete(id);

    return professionalResponsible;
  }
}
