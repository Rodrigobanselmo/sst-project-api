/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateDatabaseTableDto } from '../../dto/create-database-table.dto';
import { IDatabaseTableRepository } from '../IDatabaseTableRepository.types';
import { DatabaseTableEntity } from '../../entities/databaseTable.entity';

@Injectable()
export class ReportCharacterizationRepository {
  constructor(private prisma: PrismaService) { }

  async list(companyId: string, workspaceId: string) {
    const database = await this.prisma.companyCharacterization.findMany({
      where: { companyId, workspaceId },
      include: {
        stage: true,
        photos: true,
      }
    })

    return database
  }
}
