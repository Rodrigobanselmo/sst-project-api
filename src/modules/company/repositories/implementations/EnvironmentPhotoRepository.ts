import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { UpsertPhotoEnvironmentDto } from '../../dto/environment.dto';
import { EnvironmentPhotoEntity } from '../../entities/environment-photo.entity';

interface IEnvironmentPhoto extends UpsertPhotoEnvironmentDto {
  photoUrl: string;
  environmentId: string;
}

@Injectable()
export class EnvironmentPhotoRepository {
  constructor(private prisma: PrismaService) {}

  async upsert({
    id,
    environmentId,
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

  async delete(id: string, companyId: string, workspaceId: string) {
    const environment = await this.prisma.companyEnvironment.delete({
      where: { workspaceId_companyId_id: { workspaceId, companyId, id } },
    });

    return new EnvironmentPhotoEntity(environment);
  }
}
