import { Injectable } from '@nestjs/common';
import { Prisma, PcmsoEsocialProcedureStatusEnum } from '@prisma/client';

import { FindAllTable27Service } from '@/modules/esocial/services/tables/find-all-27.service';
import { PrismaService } from '@/prisma/prisma.service';

export type EsocialTable27CatalogItem = { code: string; name: string };

@Injectable()
export class EsocialProcedureRepository {
  constructor(
    private readonly prisma: PrismaService,
    // Leitura apenas: catálogo oficial da Tabela 27. NUNCA é escrito por este módulo.
    private readonly findAllTable27Service: FindAllTable27Service,
  ) {}

  /** Catálogo oficial da Tabela 27 (somente leitura). */
  async getOfficialCatalog(): Promise<EsocialTable27CatalogItem[]> {
    return this.findAllTable27Service.execute();
  }

  findManyCurations(procedureCodes?: string[]) {
    return this.prisma.pcmsoEsocialProcedure.findMany({
      where: {
        deleted_at: null,
        ...(procedureCodes ? { procedureCode: { in: procedureCodes } } : {}),
      },
    });
  }

  findCurationByCode(procedureCode: string) {
    return this.prisma.pcmsoEsocialProcedure.findFirst({
      where: { procedureCode, deleted_at: null },
    });
  }

  findCurationById(id: string) {
    return this.prisma.pcmsoEsocialProcedure.findFirst({
      where: { id, deleted_at: null },
    });
  }

  create(data: Prisma.PcmsoEsocialProcedureCreateInput) {
    return this.prisma.pcmsoEsocialProcedure.create({ data });
  }

  update(id: string, data: Prisma.PcmsoEsocialProcedureUpdateInput) {
    return this.prisma.pcmsoEsocialProcedure.update({ where: { id }, data });
  }

  updateStatus(id: string, status: PcmsoEsocialProcedureStatusEnum) {
    return this.prisma.pcmsoEsocialProcedure.update({
      where: { id },
      data: { status },
    });
  }

  softDelete(id: string) {
    return this.prisma.pcmsoEsocialProcedure.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }
}
