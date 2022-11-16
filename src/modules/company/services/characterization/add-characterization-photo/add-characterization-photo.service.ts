import sizeOf from 'image-size';
import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import { v4 } from 'uuid';

import { CharacterizationPhotoRepository } from '../../../repositories/implementations/CharacterizationPhotoRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { AmazonStorageProvider } from '../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { AddPhotoCharacterizationDto } from '../../../dto/characterization.dto';
import { CharacterizationRepository } from '../../../repositories/implementations/CharacterizationRepository';

@Injectable()
export class AddCharacterizationPhotoService {
  constructor(
    private readonly characterizationRepository: CharacterizationRepository,
    private readonly characterizationPhotoRepository: CharacterizationPhotoRepository,
    private readonly amazonStorageProvider: AmazonStorageProvider,
  ) {}

  async execute(addPhotoCharacterizationDto: AddPhotoCharacterizationDto, userPayloadDto: UserPayloadDto, file: Express.Multer.File) {
    const companyId = userPayloadDto.targetCompanyId;
    const [photoUrl, isVertical] = await this.upload(companyId, file);

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

  private async upload(companyId: string, file: Express.Multer.File) {
    const fileType = file.originalname.split('.')[file.originalname.split('.').length - 1];
    const path = companyId + '/characterization/' + v4() + '.' + fileType;

    const { url } = await this.amazonStorageProvider.upload({
      file: file.buffer,
      isPublic: true,
      fileName: path,
    });

    const dimensions = sizeOf(file.buffer);
    const isVertical = dimensions.width < dimensions.height;

    return [url, isVertical] as [string, boolean];
  }
}
