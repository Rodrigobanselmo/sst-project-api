import { BadRequestException, Injectable } from '@nestjs/common';
import { ImageGalleryRepository } from './../../../repositories/implementations/ImageGalleryRepository';

import { AmazonStorageProvider } from '../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';

@Injectable()
export class DeleteImageGalleryService {
  constructor(
    private readonly imageGalleryRepository: ImageGalleryRepository,
    private readonly amazonStorageProvider: AmazonStorageProvider,
  ) { }

  async execute(id: number, companyId: string) {
    const image = await this.imageGalleryRepository.findFirstNude({ where: { id, companyId } });

    if (!image?.url) {
      throw new BadRequestException('Imagem não encontrada');
    }

    const splitUrl = image.url.split('.com/');

    await this.amazonStorageProvider.delete({
      fileName: splitUrl[splitUrl.length - 1],
    });

    const deletedPhoto = await this.imageGalleryRepository.delete(id, companyId);


    return deletedPhoto;
  }
}
