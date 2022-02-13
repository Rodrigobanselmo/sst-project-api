import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateChecklistDto } from '../../dto/create-checklist.dto';
import { ChecklistEntity } from '../../entities/checklist.entity';
import { IChecklistRepository } from '../IChecklistRepository.types';

@Injectable()
export class ChecklistRepository implements IChecklistRepository {
  constructor(private prisma: PrismaService) {}
  async create(
    { data, ...createChecklistDto }: CreateChecklistDto,
    system: boolean,
  ): Promise<ChecklistEntity> {
    const checklist = await this.prisma.checklist.create({
      data: {
        ...createChecklistDto,
        data: {
          create: data,
        },
        system,
      },
      include: { data: true },
    });

    return new ChecklistEntity(checklist);
  }

  async findAllAvailable(companyId?: string) {
    const checklists = await this.prisma.checklist.findMany({
      where: { OR: [{ system: true }, { companyId }] },
    });
    return checklists.map((checklist) => new ChecklistEntity(checklist));
  }
}
