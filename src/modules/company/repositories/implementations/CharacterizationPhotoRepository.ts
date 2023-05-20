import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { AddPhotoCharacterizationDto, UpdatePhotoCharacterizationDto } from '../../dto/characterization.dto';
import { CharacterizationPhotoEntity } from '../../entities/characterization-photo.entity';

export interface ICharacterizationPhoto extends Partial<AddPhotoCharacterizationDto> {
  photoUrl: string;
  isVertical: boolean;
  companyCharacterizationId: string;
  order?: number;
  name: string;
  id?: string;
}

@Injectable()
export class CharacterizationPhotoRepository {
  constructor(private prisma: PrismaService) { }

  async createMany(characterizationPhoto: ICharacterizationPhoto[]) {
    const characterizations = await this.prisma.companyCharacterizationPhoto.createMany({
      data: characterizationPhoto.map(({ ...rest }) => ({
        ...rest,
      })),
    });

    return characterizations;
  }

  async update({ id, ...characterizationPhotoDto }: Partial<ICharacterizationPhoto>): Promise<CharacterizationPhotoEntity> {
    const characterization = await this.prisma.companyCharacterizationPhoto.update({
      where: { id: id || 'no-id' },
      data: {
        ...characterizationPhotoDto,
      },
    });

    return new CharacterizationPhotoEntity(characterization);
  }

  async upsert({ id, companyCharacterizationId: characterizationId, ...characterizationPhotoDto }: ICharacterizationPhoto): Promise<CharacterizationPhotoEntity> {
    const characterization = await this.prisma.companyCharacterizationPhoto.upsert({
      where: { id: id || 'no-id' },
      create: {
        ...characterizationPhotoDto,
        companyCharacterizationId: characterizationId,
        name: characterizationPhotoDto.name,
      },
      update: {
        ...characterizationPhotoDto,
      },
    });

    return new CharacterizationPhotoEntity(characterization);
  }

  async findByCharacterization(characterizationId: string) {
    const characterizations = await this.prisma.companyCharacterizationPhoto.findMany({
      where: { companyCharacterizationId: characterizationId },
    });

    return characterizations.map((characterization) => new CharacterizationPhotoEntity(characterization));
  }

  async findById(id: string) {
    const characterization = await this.prisma.companyCharacterizationPhoto.findUnique({
      where: { id },
    });

    return new CharacterizationPhotoEntity(characterization);
  }

  async delete(id: string) {
    const characterization = await this.prisma.companyCharacterizationPhoto.delete({
      where: { id },
    });

    return new CharacterizationPhotoEntity(characterization);
  }
}
