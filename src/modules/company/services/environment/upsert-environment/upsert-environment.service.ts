import sizeOf from 'image-size';
import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import { v4 } from 'uuid';

import { EnvironmentPhotoRepository } from '../../../../../modules/company/repositories/implementations/EnvironmentPhotoRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { AmazonStorageProvider } from '../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { UpsertEnvironmentDto } from '../../../dto/environment.dto';
import { EnvironmentRepository } from '../../../repositories/implementations/EnvironmentRepository';

@Injectable()
export class UpsertEnvironmentService {
  constructor(
    private readonly environmentRepository: EnvironmentRepository,
    private readonly environmentPhotoRepository: EnvironmentPhotoRepository,
    private readonly amazonStorageProvider: AmazonStorageProvider,
  ) {}

  async execute(
    { photos, ...upsertEnvironmentDto }: UpsertEnvironmentDto,
    workspaceId: string,
    userPayloadDto: UserPayloadDto,
    files: Array<Express.Multer.File>,
  ) {
    const companyId = userPayloadDto.targetCompanyId;

    const environment = await this.environmentRepository.upsert({
      ...upsertEnvironmentDto,
      companyId,
      workspaceId: workspaceId,
    });

    const urls = await this.upload(companyId, files);

    if (photos)
      await this.environmentPhotoRepository.createMany(
        photos.map((photo, index) => ({
          companyEnvironmentId: environment.id,
          photoUrl: urls[index][0],
          isVertical: urls[index][1],
          name: photo,
        })),
      );

    const environmentData = await this.environmentRepository.findById(
      environment.id,
    );

    return environmentData;
  }

  private async upload(companyId: string, files: Array<Express.Multer.File>) {
    const urls = await Promise.all(
      files.map(async (file) => {
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
      }),
    );

    return urls;
  }
}
