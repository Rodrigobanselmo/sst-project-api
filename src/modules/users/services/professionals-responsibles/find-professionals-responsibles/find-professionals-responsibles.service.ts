import { ProfessionalResponsibleRepository } from '../../../repositories/implementations/ProfessionalResponsibleRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { Injectable } from '@nestjs/common';
import { FindProfessionalResponsibleDto } from '../../../../../modules/users/dto/professional-responsible.dto';

@Injectable()
export class FindProfessionalResponsibleService {
  constructor(private readonly professionalResponsibleRepository: ProfessionalResponsibleRepository) {}

  async execute({ skip, take, ...query }: FindProfessionalResponsibleDto, user: UserPayloadDto) {
    const access = await this.professionalResponsibleRepository.find({ companyId: user.targetCompanyId, ...query }, { skip, take });

    return access;
  }
}
