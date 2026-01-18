import sizeOf from 'image-size';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import { v4 } from 'uuid';

import { CharacterizationPhotoRepository } from '../../../repositories/implementations/CharacterizationPhotoRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { AmazonStorageProvider } from '../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { AddPhotoCharacterizationDto } from '../../../dto/characterization.dto';
import { CharacterizationRepository } from '../../../repositories/implementations/CharacterizationRepository';
import { ErrorCompanyEnum } from 'src/shared/constants/enum/errorMessage';

@Injectable()
export class AddCharacterizationPhotoService {
  constructor(
    private readonly characterizationRepository: CharacterizationRepository,
    private readonly characterizationPhotoRepository: CharacterizationPhotoRepository,
    private readonly amazonStorageProvider: AmazonStorageProvider,
  ) {}

  async execute(addPhotoCharacterizationDto: AddPhotoCharacterizationDto, userPayloadDto: UserPayloadDto, file: any) {
    const companyId = userPayloadDto.targetCompanyId;
    const [photoUrl, isVertical] = await this.upload(companyId, file);

    if (addPhotoCharacterizationDto.id) {
      const foundPhoto = await this.characterizationPhotoRepository.findById(addPhotoCharacterizationDto.id);

      if (foundPhoto?.id) {
        throw new BadRequestException(ErrorCompanyEnum.CHAR_PHOTO_ALREADY_EXISTS);
      }
    }

    await this.characterizationPhotoRepository.createMany([
      {
        ...addPhotoCharacterizationDto,
        companyCharacterizationId: addPhotoCharacterizationDto.companyCharacterizationId,
        photoUrl,
        name: addPhotoCharacterizationDto.name,
        isVertical,
      },
    ]);

    const characterizationData = await this.characterizationRepository.findById(addPhotoCharacterizationDto.companyCharacterizationId);

    return characterizationData;
  }

  public async upload(companyId: string, file: any, opt?: { id?: string }) {
    const fileType = file.originalname.split('.')[file.originalname.split('.').length - 1];
    const path = 'characterization/' + (opt?.id || v4()) + '.' + fileType;

    const { url } = await this.amazonStorageProvider.upload({
      file: file.buffer,
      isPublic: true,
      fileName: path,
    });

    const dimensions = sizeOf(file.buffer as any);
    const isVertical = dimensions.width < dimensions.height;

    return [url, isVertical] as [string, boolean];
  }
}
