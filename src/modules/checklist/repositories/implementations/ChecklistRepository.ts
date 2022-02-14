/* eslint-disable @typescript-eslint/no-unused-vars */
import { UpdateChecklistDto } from './../../dto/update-checklist.dto';
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

  async findChecklistData(id: number) {
    const checklist = await this.prisma.checklist.findUnique({
      where: { id },
      include: { data: true },
    });

    return new ChecklistEntity(checklist);
  }

  async update(
    id: number,
    {
      data: { json },
      ...updateChecklistDto
    }: Omit<UpdateChecklistDto, 'companyId'>,
  ) {
    const checklist = await this.prisma.checklist.update({
      data: { ...updateChecklistDto, data: { update: { json } } },
      where: { id },
      include: { data: true },
    });

    return new ChecklistEntity(checklist);
  }
}
