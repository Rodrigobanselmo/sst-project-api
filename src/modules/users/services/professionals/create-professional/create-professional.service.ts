import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from './../../../../../shared/dto/user-payload.dto';
import { CreateProfessionalDto } from './../../../dto/professional.dto';
import { ProfessionalRepository } from './../../../repositories/implementations/ProfessionalRepository';

@Injectable()
export class CreateProfessionalService {
  constructor(
    private readonly professionalRepository: ProfessionalRepository,
  ) {}

  async execute(
    { ...createDataDto }: CreateProfessionalDto,
    user: UserPayloadDto,
  ) {
    const professional = await this.professionalRepository.create(
      createDataDto,
      user.targetCompanyId,
    );

    return professional;
  }
}
