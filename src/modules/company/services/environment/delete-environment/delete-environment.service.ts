import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { EnvironmentRepository } from '../../../repositories/implementations/EnvironmentRepository';

@Injectable()
export class DeleteEnvironmentService {
  constructor(private readonly environmentRepository: EnvironmentRepository) {}

  async execute(
    id: string,
    workspaceId: string,
    userPayloadDto: UserPayloadDto,
  ) {
    const environments = await this.environmentRepository.delete(
      id,
      userPayloadDto.targetCompanyId,
      workspaceId,
    );

    return environments;
  }
}
