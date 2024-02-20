import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { AddFileCharacterizationDto } from '../../dto/characterization.dto';
import { CharacterizationFileEntity } from '../../entities/characterization-file.entity';

export interface ICharacterizationFile extends Partial<AddFileCharacterizationDto> {
  url: string;
}

@Injectable()
export class CharacterizationFileRepository {
  constructor(private prisma: PrismaService) { }

  async update({ id, ...fileDTO }: Partial<ICharacterizationFile>): Promise<CharacterizationFileEntity> {
    const characterization = await this.prisma.companyCharacterizationFile.update({
      where: { id: id || 'no-id' },
      data: {
        ...fileDTO,
      },
    });

    return new CharacterizationFileEntity(characterization);
  }

  async upsert({ id, companyCharacterizationId: characterizationId, ...fileDTO }: ICharacterizationFile): Promise<CharacterizationFileEntity> {
    const characterization = await this.prisma.companyCharacterizationFile.upsert({
      where: { id: id || 'no-id' },
      create: {
        ...fileDTO,
        companyCharacterizationId: characterizationId,
      },
      update: {
        ...fileDTO,
      },
    });

    return new CharacterizationFileEntity(characterization);
  }

  async findByCharacterization(characterizationId: string) {
    const characterizations = await this.prisma.companyCharacterizationFile.findMany({
      where: { companyCharacterizationId: characterizationId },
    });

    return characterizations.map((characterization) => new CharacterizationFileEntity(characterization));
  }

  async findById(id: string) {
    const characterization = await this.prisma.companyCharacterizationFile.findUnique({
      where: { id },
    });

    return new CharacterizationFileEntity(characterization);
  }

  async delete(id: string) {
    const characterization = await this.prisma.companyCharacterizationFile.delete({
      where: { id },
    });

    return new CharacterizationFileEntity(characterization);
  }
}
