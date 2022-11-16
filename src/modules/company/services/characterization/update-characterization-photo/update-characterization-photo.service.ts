import { Injectable } from '@nestjs/common';

import { UpdatePhotoCharacterizationDto } from '../../../dto/characterization.dto';
import { CharacterizationPhotoRepository } from '../../../repositories/implementations/CharacterizationPhotoRepository';
import { CharacterizationRepository } from '../../../repositories/implementations/CharacterizationRepository';

@Injectable()
export class UpdateCharacterizationPhotoService {
  constructor(
    private readonly characterizationRepository: CharacterizationRepository,
    private readonly characterizationPhotoRepository: CharacterizationPhotoRepository,
  ) {}

  async execute(id: string, updatePhotoCharacterizationDto: UpdatePhotoCharacterizationDto) {
    const characterizationPhoto = await this.characterizationPhotoRepository.update({
      ...updatePhotoCharacterizationDto,
      id,
    });

    const characterizationData = await this.characterizationRepository.findById(characterizationPhoto.companyCharacterizationId);

    return characterizationData;
  }
}
