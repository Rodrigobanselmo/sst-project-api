import { AmazonStorageProvider } from './../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { EnvironmentPhotoRepository } from './../../../repositories/implementations/EnvironmentPhotoRepository';
import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { EnvironmentRepository } from '../../../repositories/implementations/EnvironmentRepository';

@Injectable()
export class DeleteEnvironmentService {
  constructor(
    private readonly environmentRepository: EnvironmentRepository,
    private readonly environmentPhotoRepository: EnvironmentPhotoRepository,
    private readonly amazonStorageProvider: AmazonStorageProvider,
  ) {}

  async execute(
    id: string,
    workspaceId: string,
    userPayloadDto: UserPayloadDto,
  ) {
    const photos = await this.environmentPhotoRepository.findByEnvironment(id);
    Promise.all(
      photos.map(async (photo) => {
        const splitUrl = photo.photoUrl.split('/');

        await this.amazonStorageProvider.delete({
          fileName: splitUrl[splitUrl.length - 1],
        });

        await this.environmentPhotoRepository.delete(id);
      }),
    );

    const environments = await this.environmentRepository.delete(
      id,
      userPayloadDto.targetCompanyId,
      workspaceId,
    );

    return environments;
  }
}
