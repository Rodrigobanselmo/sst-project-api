import { BadRequestException, Injectable } from '@nestjs/common';

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
    const professionalFound = await this.professionalRepository.findFirstNude({
      where: {
        companyId: user.targetCompanyId,
        OR: [
          { cpf: createDataDto.cpf || 'not-found' },
          { user: { email: createDataDto.email || 'not-found' } },
          {
            councilId: createDataDto.councilId || 'not-found',
            councilType: createDataDto.councilType || 'not-found',
            councilUF: createDataDto.councilUF || 'not-found',
          },
        ],
      },
    });

    if (professionalFound?.id)
      throw new BadRequestException('Professional já cadastrado');

    const professional = await this.professionalRepository.create(
      createDataDto,
      user.targetCompanyId,
    );

    return professional;
  }
}
