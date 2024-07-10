import { FindImageGalleryDto } from '../../../dto/imageGallery.dto';
import { ImageGalleryRepository } from '../../../repositories/implementations/ImageGalleryRepository';
import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CharacterizationRepository } from '../../../repositories/implementations/CharacterizationRepository';

@Injectable()
export class FindImageGalleryService {
  constructor(private readonly imageGalleryRepository: ImageGalleryRepository) {}

  async execute({ skip, take, ...query }: FindImageGalleryDto, user: UserPayloadDto) {
    const result = await this.imageGalleryRepository.findAllByCompany(
      { companyId: user.targetCompanyId, ...query },
      { skip, take },
    );

    return result;
  }
}
