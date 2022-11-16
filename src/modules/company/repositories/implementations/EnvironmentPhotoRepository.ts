import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { AddPhotoEnvironmentDto, UpdatePhotoEnvironmentDto } from '../../dto/environment.dto';
import { EnvironmentPhotoEntity } from '../../entities/environment-photo.entity';

export interface IEnvironmentPhoto extends Partial<AddPhotoEnvironmentDto> {
  photoUrl: string;
  isVertical: boolean;
  companyCharacterizationId: string;
  name: string;
  id?: string;
}

@Injectable()
export class EnvironmentPhotoRepository {
  constructor(private prisma: PrismaService) {}

  async createMany(environmentPhoto: IEnvironmentPhoto[]) {
    const environments = await this.prisma.companyCharacterizationPhoto.createMany({
      data: environmentPhoto.map(({ ...rest }) => ({
        ...rest,
      })),
    });

    return environments;
  }

  async update({ id, ...environmentPhotoDto }: UpdatePhotoEnvironmentDto): Promise<EnvironmentPhotoEntity> {
    const environment = await this.prisma.companyCharacterizationPhoto.update({
      where: { id: id || 'no-id' },
      data: {
        ...environmentPhotoDto,
      },
    });

    return new EnvironmentPhotoEntity(environment);
  }

  async findById(id: string) {
    const environment = await this.prisma.companyCharacterizationPhoto.findUnique({
      where: { id },
    });

    return new EnvironmentPhotoEntity(environment);
  }

  async findByEnvironment(environmentId: string) {
    const environments = await this.prisma.companyCharacterizationPhoto.findMany({
      where: { companyCharacterizationId: environmentId },
    });

    return environments.map((environment) => new EnvironmentPhotoEntity(environment));
  }

  async delete(id: string) {
    const environment = await this.prisma.companyCharacterizationPhoto.delete({
      where: { id },
    });

    return new EnvironmentPhotoEntity(environment);
  }
}
