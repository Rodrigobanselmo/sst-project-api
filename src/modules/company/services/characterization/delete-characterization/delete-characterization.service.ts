import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CharacterizationRepository } from '../../../repositories/implementations/CharacterizationRepository';

@Injectable()
export class DeleteCharacterizationService {
  constructor(
    private readonly characterizationRepository: CharacterizationRepository,
  ) {}

  async execute(
    id: string,
    workspaceId: string,
    userPayloadDto: UserPayloadDto,
  ) {
    const characterizations = await this.characterizationRepository.delete(
      id,
      userPayloadDto.targetCompanyId,
      workspaceId,
    );

    return characterizations;
  }
}
