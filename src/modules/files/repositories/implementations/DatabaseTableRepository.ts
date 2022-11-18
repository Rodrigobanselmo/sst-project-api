/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateDatabaseTableDto } from '../../dto/create-database-table.dto';
import { IDatabaseTableRepository } from '../IDatabaseTableRepository.types';
import { DatabaseTableEntity } from './../../entities/databaseTable.entity';

@Injectable()
export class DatabaseTableRepository implements IDatabaseTableRepository {
  constructor(private prisma: PrismaService) {}
  async upsert(createDatabaseTableDto: CreateDatabaseTableDto, companyId: string, system: boolean, id?: number): Promise<DatabaseTableEntity> {
    delete createDatabaseTableDto.companyId;

    const database = await this.prisma.databaseTable.upsert({
      where: { id_companyId: { companyId, id: id || -1 } },
      create: {
        ...createDatabaseTableDto,
        system,
        companyId,
      },
      update: {
        ...createDatabaseTableDto,
        system,
        companyId,
      },
    });
    return new DatabaseTableEntity(database);
  }

  async findByNameAndCompany(name: string, companyId: string): Promise<DatabaseTableEntity> {
    const database = await this.prisma.databaseTable.findFirst({
      where: { name, companyId },
      include: {
        company: {
          select: {
            initials: true,
            name: true,
            fantasy: true,
          },
        },
      },
    });
    if (!database) {
      return new DatabaseTableEntity({ version: 1, updated_at: new Date() });
    }
    return new DatabaseTableEntity(database);
  }
}
