import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { UpsertEnvironmentDto } from '../../../dto/environment.dto';
import { EnvironmentRepository } from '../../../repositories/implementations/EnvironmentRepository';

@Injectable()
export class UpsertEnvironmentService {
  constructor(private readonly environmentRepository: EnvironmentRepository) {}

  async execute(
    upsertEnvironmentDto: UpsertEnvironmentDto,
    workspaceId: string,
    userPayloadDto: UserPayloadDto,
  ) {
    const environments = await this.environmentRepository.upsert({
      ...upsertEnvironmentDto,
      companyId: userPayloadDto.targetCompanyId,
      workspaceId: workspaceId,
    });

    return environments;
  }
}
