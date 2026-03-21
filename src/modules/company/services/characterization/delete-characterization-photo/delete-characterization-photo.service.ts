import { Injectable } from '@nestjs/common';

import { CharacterizationPhotoRepository } from '../../../repositories/implementations/CharacterizationPhotoRepository';
import { CharacterizationRepository } from '../../../repositories/implementations/CharacterizationRepository';

@Injectable()
export class DeleteCharacterizationPhotoService {
  constructor(
    private readonly characterizationRepository: CharacterizationRepository,
    private readonly characterizationPhotoRepository: CharacterizationPhotoRepository,
  ) {}

  async execute(id: string) {
    // Remove apenas o vínculo no banco; o arquivo permanece no S3.
    const deletedPhoto = await this.characterizationPhotoRepository.delete(id);

    const characterizationData = await this.characterizationRepository.findById(deletedPhoto.companyCharacterizationId);

    return characterizationData;
  }
}
