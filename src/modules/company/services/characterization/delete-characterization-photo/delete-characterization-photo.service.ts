import { Injectable } from '@nestjs/common';

import { CharacterizationPhotoRepository } from '../../../repositories/implementations/CharacterizationPhotoRepository';
import { AmazonStorageProvider } from '../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { CharacterizationRepository } from '../../../repositories/implementations/CharacterizationRepository';

@Injectable()
export class DeleteCharacterizationPhotoService {
  constructor(
    private readonly characterizationRepository: CharacterizationRepository,
    private readonly characterizationPhotoRepository: CharacterizationPhotoRepository,
    private readonly amazonStorageProvider: AmazonStorageProvider,
  ) {}

  async execute(id: string) {
    const photo = await this.characterizationPhotoRepository.findById(id);
    const splitUrl = photo.photoUrl.split('/');

    await this.amazonStorageProvider.delete({
      fileName: splitUrl[splitUrl.length - 1],
    });

    const deletedPhoto = await this.characterizationPhotoRepository.delete(id);

    const characterizationData = await this.characterizationRepository.findById(
      deletedPhoto.companyCharacterizationId,
    );

    return characterizationData;
  }
}
