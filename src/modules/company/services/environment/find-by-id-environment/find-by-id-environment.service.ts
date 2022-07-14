import { ErrorCompanyEnum } from './../../../../../shared/constants/enum/errorMessage';
import { BadRequestException, Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { EnvironmentRepository } from '../../../repositories/implementations/EnvironmentRepository';

@Injectable()
export class FindByIdEnvironmentService {
  constructor(private readonly environmentRepository: EnvironmentRepository) {}

  async execute(id: string, userPayloadDto: UserPayloadDto) {
    const environment = await this.environmentRepository.findById(id, {
      getRiskData: true,
      include: {
        photos: true,
      },
    });

    if (environment.companyId != userPayloadDto.targetCompanyId)
      throw new BadRequestException(ErrorCompanyEnum.ENVIRONMENT_NOT_FOUND);

    return environment;
  }
}
