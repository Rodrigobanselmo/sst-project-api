import { HomoGroupRepository } from './../../../repositories/implementations/HomoGroupRepository';
import { AmazonStorageProvider } from './../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { EnvironmentPhotoRepository } from './../../../repositories/implementations/EnvironmentPhotoRepository';
import { BadRequestException, Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { EnvironmentRepository } from '../../../repositories/implementations/EnvironmentRepository';
import { ErrorMessageEnum } from '../../../../../shared/constants/enum/errorMessage';

@Injectable()
export class DeleteEnvironmentService {
  constructor(
    private readonly environmentRepository: EnvironmentRepository,
    private readonly environmentPhotoRepository: EnvironmentPhotoRepository,
    private readonly amazonStorageProvider: AmazonStorageProvider,
    private readonly homoGroupRepository: HomoGroupRepository,
  ) {}

  async execute(
    id: string,
    workspaceId: string,
    userPayloadDto: UserPayloadDto,
  ) {
    const photos = await this.environmentPhotoRepository.findByEnvironment(id);

    await Promise.all(
      photos.map(async (photo) => {
        const splitUrl = photo.photoUrl.split('.com/');

        await this.amazonStorageProvider.delete({
          fileName: splitUrl[splitUrl.length - 1],
        });

        await this.environmentPhotoRepository.delete(photo.id);
      }),
    );

    const environments = await this.environmentRepository.findById(id);

    if (environments.companyId !== userPayloadDto.targetCompanyId) {
      throw new BadRequestException(
        ErrorMessageEnum.NOT_FOUND_ON_COMPANY_TO_DELETE,
      );
    }

    await this.homoGroupRepository.deleteById(id);

    return environments;
  }
}
