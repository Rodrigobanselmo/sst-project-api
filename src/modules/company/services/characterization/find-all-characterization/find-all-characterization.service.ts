import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CharacterizationRepository } from '../../../repositories/implementations/CharacterizationRepository';

@Injectable()
export class FindAllCharacterizationService {
  constructor(
    private readonly characterizationRepository: CharacterizationRepository,
  ) {}

  async execute(workspaceId: string, userPayloadDto: UserPayloadDto) {
    const characterizations = await this.characterizationRepository.findAll(
      userPayloadDto.targetCompanyId,
      workspaceId,
      { include: { photos: true } },
    );

    return characterizations;
  }
}
