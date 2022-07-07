import sizeOf from 'image-size';
import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import { v4 } from 'uuid';

import { CharacterizationPhotoRepository } from '../../../repositories/implementations/CharacterizationPhotoRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { AmazonStorageProvider } from '../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { UpsertCharacterizationDto } from '../../../dto/characterization.dto';
import { CharacterizationRepository } from '../../../repositories/implementations/CharacterizationRepository';

@Injectable()
export class UpsertCharacterizationService {
  constructor(
    private readonly characterizationRepository: CharacterizationRepository,
    private readonly characterizationPhotoRepository: CharacterizationPhotoRepository,
    private readonly amazonStorageProvider: AmazonStorageProvider,
  ) {}

  async execute(
    { photos, ...upsertCharacterizationDto }: UpsertCharacterizationDto,
    workspaceId: string,
    userPayloadDto: UserPayloadDto,
    files: Array<Express.Multer.File>,
  ) {
    const companyId = userPayloadDto.targetCompanyId;

    const characterization = await this.characterizationRepository.upsert({
      ...upsertCharacterizationDto,
      companyId,
      workspaceId: workspaceId,
    });

    const urls = await this.upload(companyId, files);

    if (photos)
      await this.characterizationPhotoRepository.createMany(
        photos.map((photo, index) => ({
          companyCharacterizationId: characterization.id,
          photoUrl: urls[index][0],
          isVertical: urls[index][1],
          name: photo,
        })),
      );

    const characterizationData = await this.characterizationRepository.findById(
      characterization.id,
    );

    return characterizationData;
  }

  private async upload(companyId: string, files: Array<Express.Multer.File>) {
    const urls = await Promise.all(
      files.map(async (file) => {
        const fileType =
          file.originalname.split('.')[file.originalname.split('.').length - 1];
        const path = companyId + '/characterization/' + v4() + '.' + fileType;

        const { url } = await this.amazonStorageProvider.upload({
          file: file.buffer,
          isPublic: true,
          fileName: path,
        });

        const dimensions = sizeOf(file.buffer);
        const isVertical = dimensions.width < dimensions.height;

        return [url, isVertical] as [string, boolean];
      }),
    );

    return urls;
  }
}
