import { UserPayloadDto } from './../../../../../shared/dto/user-payload.dto';
import { AmazonStorageProvider } from './../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { Injectable } from '@nestjs/common';

import { UpdatePhotoCharacterizationDto } from '../../../dto/characterization.dto';
import { CharacterizationPhotoRepository } from '../../../repositories/implementations/CharacterizationPhotoRepository';
import { CharacterizationRepository } from '../../../repositories/implementations/CharacterizationRepository';
import { AddCharacterizationPhotoService } from '../add-characterization-photo/add-characterization-photo.service';

@Injectable()
export class UpdateCharacterizationPhotoService {
  constructor(
    private readonly characterizationRepository: CharacterizationRepository,
    private readonly characterizationPhotoRepository: CharacterizationPhotoRepository,
    private readonly addCharacterizationPhotoService: AddCharacterizationPhotoService,
    private readonly amazonStorageProvider: AmazonStorageProvider,
  ) { }

  async execute(id: string, file: Express.Multer.File, updatePhotoCharacterizationDto: UpdatePhotoCharacterizationDto, user: UserPayloadDto) {
    let photoUrl: string;
    let isVertical: boolean;

    if (file) {
      const photo = await this.characterizationPhotoRepository.findById(id);
      const splitUrl = photo.photoUrl.split('/');
      const fileName = splitUrl[splitUrl.length - 1] as string;

      [photoUrl, isVertical] = await this.addCharacterizationPhotoService.upload(photo.companyCharacterizationId, file, { id: fileName.split('.')[0] });
    }

    const characterizationPhoto = await this.characterizationPhotoRepository.update({
      ...updatePhotoCharacterizationDto,
      photoUrl,
      isVertical,
      id,
    });

    const characterizationData = await this.characterizationRepository.findById(characterizationPhoto.companyCharacterizationId);

    return characterizationData;
  }
}
