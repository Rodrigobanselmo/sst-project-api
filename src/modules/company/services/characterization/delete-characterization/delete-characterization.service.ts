import { ErrorMessageEnum } from './../../../../../shared/constants/enum/errorMessage';
import { HomoGroupRepository } from './../../../repositories/implementations/HomoGroupRepository';
import { CharacterizationPhotoRepository } from './../../../repositories/implementations/CharacterizationPhotoRepository';
import { AmazonStorageProvider } from './../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { BadRequestException, Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CharacterizationRepository } from '../../../repositories/implementations/CharacterizationRepository';

@Injectable()
export class DeleteCharacterizationService {
  constructor(
    private readonly characterizationRepository: CharacterizationRepository,
    private readonly characterizationPhotoRepository: CharacterizationPhotoRepository,
    private readonly amazonStorageProvider: AmazonStorageProvider,
    private readonly homoGroupRepository: HomoGroupRepository,
  ) {}

  async execute(
    id: string,
    workspaceId: string,
    userPayloadDto: UserPayloadDto,
  ) {
    const photos =
      await this.characterizationPhotoRepository.findByCharacterization(id);

    await Promise.all(
      photos.map(async (photo) => {
        const splitUrl = photo.photoUrl.split('.com/');

        await this.amazonStorageProvider.delete({
          fileName: splitUrl[splitUrl.length - 1],
        });

        await this.characterizationPhotoRepository.delete(photo.id);
      }),
    );

    const characterizations = await this.characterizationRepository.findById(
      id,
    );

    if (characterizations.companyId !== userPayloadDto.targetCompanyId) {
      throw new BadRequestException(
        ErrorMessageEnum.NOT_FOUND_ON_COMPANY_TO_DELETE,
      );
    }

    characterizations.profiles.forEach(async (profile) => {
      await this.characterizationRepository.delete(
        profile.id,
        userPayloadDto.targetCompanyId,
        workspaceId,
      );
      await this.homoGroupRepository.deleteById(profile.id);
    });

    await this.characterizationRepository.delete(
      id,
      userPayloadDto.targetCompanyId,
      workspaceId,
    );
    await this.homoGroupRepository.deleteById(id);

    return characterizations;
  }
}
