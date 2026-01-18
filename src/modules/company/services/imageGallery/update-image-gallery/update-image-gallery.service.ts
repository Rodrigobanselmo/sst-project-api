import { Injectable } from '@nestjs/common';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { AmazonStorageProvider } from '../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { UpdateImageGalleryDto } from './../../../dto/imageGallery.dto';
import { ImageGalleryRepository } from './../../../repositories/implementations/ImageGalleryRepository';

import { CreateImageGalleyService } from '../create-image-gallery/create-image-gallery.service';

@Injectable()
export class UpdateImageGalleryService {
  constructor(
    private readonly imageGalleryRepository: ImageGalleryRepository,
    private readonly createImageGalleyService: CreateImageGalleyService,
    private readonly amazonStorageProvider: AmazonStorageProvider,
  ) {}

  async execute(id: number, file: any, body: UpdateImageGalleryDto, user: UserPayloadDto) {
    const companyId = user.targetCompanyId;
    let url: string;

    if (file) {
      const image = await this.imageGalleryRepository.findFirstNude({ where: { id, companyId } });
      const splitUrl = image.url.split('/');
      const fileName = splitUrl[splitUrl.length - 1] as string;

      url = await this.createImageGalleyService.upload(companyId, file, { id: fileName.split('.')[0] });
    }

    const result = await this.imageGalleryRepository.update({
      ...body,
      url,
      id,
    });

    return result;
  }
}
