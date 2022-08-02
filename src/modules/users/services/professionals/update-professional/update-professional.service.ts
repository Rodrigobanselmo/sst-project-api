import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { UpdateProfessionalDto } from '../../../dto/professional.dto';
import { ProfessionalRepository } from '../../../repositories/implementations/ProfessionalRepository';

@Injectable()
export class UpdateProfessionalService {
  constructor(
    private readonly professionalRepository: ProfessionalRepository,
  ) {}

  async execute(
    { ...updateDataDto }: UpdateProfessionalDto,
    user: UserPayloadDto,
  ) {
    const professional = await this.professionalRepository.update(
      updateDataDto,
      user.targetCompanyId,
    );

    return professional;
  }
}
