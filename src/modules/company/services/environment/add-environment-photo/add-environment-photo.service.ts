import sizeOf from 'image-size';
import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import { v4 } from 'uuid';

import { EnvironmentPhotoRepository } from '../../../../../modules/company/repositories/implementations/EnvironmentPhotoRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { AmazonStorageProvider } from '../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { AddPhotoEnvironmentDto } from '../../../dto/environment.dto';
import { EnvironmentRepository } from '../../../repositories/implementations/EnvironmentRepository';

@Injectable()
export class AddEnvironmentPhotoService {
  constructor(
    private readonly environmentRepository: EnvironmentRepository,
    private readonly environmentPhotoRepository: EnvironmentPhotoRepository,
    private readonly amazonStorageProvider: AmazonStorageProvider,
  ) {}

  async execute(
    addPhotoEnvironmentDto: AddPhotoEnvironmentDto,
    userPayloadDto: UserPayloadDto,
    file: Express.Multer.File,
  ) {
    const companyId = userPayloadDto.targetCompanyId;
    const [photoUrl, isVertical] = await this.upload(companyId, file);

    await this.environmentPhotoRepository.createMany([
      {
        companyEnvironmentId: addPhotoEnvironmentDto.companyEnvironmentId,
        photoUrl,
        name: addPhotoEnvironmentDto.name,
        isVertical,
      },
    ]);

    const environmentData = await this.environmentRepository.findById(
      addPhotoEnvironmentDto.companyEnvironmentId,
    );

    return environmentData;
  }

  private async upload(companyId: string, file: Express.Multer.File) {
    // const stream = Readable.from(file.buffer);
    const fileType =
      file.originalname.split('.')[file.originalname.split('.').length - 1];
    const path = companyId + '/environment/' + v4() + '.' + fileType;

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
