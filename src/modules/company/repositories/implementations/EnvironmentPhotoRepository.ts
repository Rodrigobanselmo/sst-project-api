import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import {
  AddPhotoEnvironmentDto,
  UpdatePhotoEnvironmentDto,
} from '../../dto/environment.dto';
import { EnvironmentPhotoEntity } from '../../entities/environment-photo.entity';

export interface IEnvironmentPhoto extends Partial<AddPhotoEnvironmentDto> {
  photoUrl: string;
  isVertical: boolean;
  companyEnvironmentId: string;
  order?: number;
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

  async update({
    id,
    ...environmentPhotoDto
  }: UpdatePhotoEnvironmentDto): Promise<EnvironmentPhotoEntity> {
    console.log(environmentPhotoDto);
    const environment = await this.prisma.companyEnvironmentPhoto.update({
      where: { id: id || 'no-id' },
      data: {
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

  async findByEnvironment(environmentId: string) {
    const environments = await this.prisma.companyEnvironmentPhoto.findMany({
      where: { companyEnvironmentId: environmentId },
    });

    return environments.map(
      (environment) => new EnvironmentPhotoEntity(environment),
    );
  }

  async delete(id: string) {
    const environment = await this.prisma.companyEnvironmentPhoto.delete({
      where: { id },
    });

    return new EnvironmentPhotoEntity(environment);
  }
}
