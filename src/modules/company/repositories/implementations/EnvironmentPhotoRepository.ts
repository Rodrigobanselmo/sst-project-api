import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { AddPhotoEnvironmentDto } from '../../dto/environment.dto';
import { EnvironmentPhotoEntity } from '../../entities/environment-photo.entity';

export interface IEnvironmentPhoto extends Partial<AddPhotoEnvironmentDto> {
  photoUrl: string;
  companyEnvironmentId: string;
  name: string;
  id?: string;
}

@Injectable()
export class EnvironmentPhotoRepository {
  constructor(private prisma: PrismaService) {}

  async createMany(environmentPhoto: IEnvironmentPhoto[]) {
    const environments = await this.prisma.companyEnvironmentPhoto.createMany({
      data: environmentPhoto.map(({ ...rest }) => ({
        ...rest,
      })),
    });

    return environments;
  }

  async upsert({
    id,
    companyEnvironmentId: environmentId,
    ...environmentPhotoDto
  }: IEnvironmentPhoto): Promise<EnvironmentPhotoEntity> {
    const environment = await this.prisma.companyEnvironmentPhoto.upsert({
      where: { id: id || 'no-id' },
      create: {
        ...environmentPhotoDto,
        companyEnvironmentId: environmentId,
        name: environmentPhotoDto.name,
      },
      update: {
        ...environmentPhotoDto,
      },
    });

    return new EnvironmentPhotoEntity(environment);
  }

  async findById(id: string) {
    const environment = await this.prisma.companyEnvironmentPhoto.findUnique({
      where: { id },
    });

    return new EnvironmentPhotoEntity(environment);
  }

  async delete(id: string) {
    const environment = await this.prisma.companyEnvironmentPhoto.delete({
      where: { id },
    });

    return new EnvironmentPhotoEntity(environment);
  }
}
