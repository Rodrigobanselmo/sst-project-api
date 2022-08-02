import { FindProfessionalsDto } from './../../../dto/professional.dto';
import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ProfessionalRepository } from './../../../repositories/implementations/ProfessionalRepository';

@Injectable()
export class FindAllProfessionalsByCompanyService {
  constructor(
    private readonly professionalRepository: ProfessionalRepository,
  ) {}
  async execute(
    { skip, take, ...query }: FindProfessionalsDto,
    user: UserPayloadDto,
  ) {
    const professionals = await this.professionalRepository.findByCompanyId(
      { ...query, companyId: user.targetCompanyId },
      { skip, take },
    );

    return professionals;
  }
}
