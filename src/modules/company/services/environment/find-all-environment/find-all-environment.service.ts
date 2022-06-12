import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { EnvironmentRepository } from '../../../repositories/implementations/EnvironmentRepository';

@Injectable()
export class FindAllEnvironmentService {
  constructor(private readonly environmentRepository: EnvironmentRepository) {}

  async execute(workspaceId: string, userPayloadDto: UserPayloadDto) {
    const environments = await this.environmentRepository.findAll(
      userPayloadDto.targetCompanyId,
      workspaceId,
      { include: { photos: true } },
    );

    return environments;
  }
}
