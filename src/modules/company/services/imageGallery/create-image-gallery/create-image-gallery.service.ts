import { CreateImageGalleryDto } from './../../../dto/imageGallery.dto';
import { ImageGalleryRepository } from './../../../repositories/implementations/ImageGalleryRepository';
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
export class CreateImageGalleyService {
  constructor(
    private readonly imageGalleryRepository: ImageGalleryRepository,
    private readonly amazonStorageProvider: AmazonStorageProvider,
  ) {}

  async execute(body: CreateImageGalleryDto, userPayloadDto: UserPayloadDto, file: any) {
    const companyId = userPayloadDto.targetCompanyId;
    const url = await this.upload(companyId, file);

    const result = await this.imageGalleryRepository.create({
      ...body,
      companyId,
      url,
    });

    return result;
  }

  public async upload(companyId: string, file: any, opt?: { id?: string }) {
    const fileType = file.originalname.split('.')[file.originalname.split('.').length - 1];
    const path = 'gallery/' + (opt?.id || v4()) + '.' + fileType;

    const { url } = await this.amazonStorageProvider.upload({
      file: file.buffer,
      isPublic: true,
      fileName: path,
    });

    return url;
  }
}
