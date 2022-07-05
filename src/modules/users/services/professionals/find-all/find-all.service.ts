import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ProfessionalRepository } from './../../../repositories/implementations/ProfessionalRepository';

@Injectable()
export class FindAllProfessionalsByCompanyService {
  constructor(
    private readonly professionalRepository: ProfessionalRepository,
  ) {}
  async execute(user: UserPayloadDto) {
    const professionals = await this.professionalRepository.findByCompanyId(
      user.targetCompanyId,
    );

    return professionals;
  }
}
