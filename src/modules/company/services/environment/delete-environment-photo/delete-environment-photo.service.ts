import { Injectable } from '@nestjs/common';

import { EnvironmentPhotoRepository } from '../../../../../modules/company/repositories/implementations/EnvironmentPhotoRepository';
import { AmazonStorageProvider } from '../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { EnvironmentRepository } from '../../../repositories/implementations/EnvironmentRepository';

@Injectable()
export class DeleteEnvironmentPhotoService {
  constructor(
    private readonly environmentRepository: EnvironmentRepository,
    private readonly environmentPhotoRepository: EnvironmentPhotoRepository,
    private readonly amazonStorageProvider: AmazonStorageProvider,
  ) {}

  async execute(id: string) {
    const photo = await this.environmentPhotoRepository.findById(id);
    const splitUrl = photo.photoUrl.split('.com/');

    await this.amazonStorageProvider.delete({
      fileName: splitUrl[splitUrl.length - 1],
    });

    const deletedPhoto = await this.environmentPhotoRepository.delete(id);

    const environmentData = await this.environmentRepository.findById(
      deletedPhoto.companyCharacterizationId,
    );

    return environmentData;
  }
}
