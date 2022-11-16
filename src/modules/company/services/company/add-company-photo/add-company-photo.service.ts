import sizeOf from 'image-size';
import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import { v4 } from 'uuid';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { AmazonStorageProvider } from '../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { CompanyRepository } from '../../../repositories/implementations/CompanyRepository';

@Injectable()
export class AddCompanyPhotoService {
  constructor(private readonly companyRepository: CompanyRepository, private readonly amazonStorageProvider: AmazonStorageProvider) {}

  async execute(userPayloadDto: UserPayloadDto, file: Express.Multer.File) {
    const companyId = userPayloadDto.targetCompanyId;
    const [photoUrl] = await this.upload(companyId, file);

    const companyData = await this.companyRepository.update({
      companyId,
      logoUrl: photoUrl,
    });

    return companyData;
  }

  private async upload(companyId: string, file: Express.Multer.File) {
    const fileType = file.originalname.split('.')[file.originalname.split('.').length - 1];
    const path = companyId + '/company/' + v4() + '.' + fileType;

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
