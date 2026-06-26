import { Injectable, NotFoundException } from '@nestjs/common';
import {
  PcmsoEsocialProcedure,
  PcmsoEsocialProcedureSourceEnum,
  PcmsoEsocialProcedureStatusEnum,
} from '@prisma/client';

import {
  BrowseEsocialProceduresQuery,
  UpsertEsocialProcedureBody,
} from './esocial-procedure.dto';
import {
  EsocialProcedureRepository,
  EsocialTable27CatalogItem,
} from './esocial-procedure.repository';

export type EsocialProcedureMergedItem = {
  // Dados oficiais eSocial (somente leitura).
  procedureCode: string;
  officialName: string | null;
  // True quando há curadoria para um código que não está mais no catálogo oficial.
  isOrphanCuration: boolean;
  // Curadoria SimpleSST (null quando ainda não curado).
  curation: PcmsoEsocialProcedure | null;
};

const normalize = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

@Injectable()
export class EsocialProcedureService {
  constructor(private readonly repository: EsocialProcedureRepository) {}

  async browse(params: {
    page: number;
    limit: number;
    filters?: {
      search?: string;
      status?: PcmsoEsocialProcedureStatusEnum;
      technicalType?: BrowseEsocialProceduresQuery['technicalType'];
      isOccupationalRelevant?: boolean;
      onlyCurated?: boolean;
    };
  }) {
    const filters = params.filters ?? {};
    const [catalog, curations] = await Promise.all([
      this.repository.getOfficialCatalog(),
      this.repository.findManyCurations(),
    ]);

    const curationByCode = new Map(
      curations.map((curation) => [curation.procedureCode, curation]),
    );
    const catalogCodes = new Set(catalog.map((item) => item.code));

    const merged: EsocialProcedureMergedItem[] = catalog.map((item) => ({
      procedureCode: item.code,
      officialName: item.name,
      isOrphanCuration: false,
      curation: curationByCode.get(item.code) ?? null,
    }));

    // Curadorias órfãs: código curado que não está mais no catálogo oficial.
    for (const curation of curations) {
      if (!catalogCodes.has(curation.procedureCode)) {
        merged.push({
          procedureCode: curation.procedureCode,
          officialName: curation.procedureNameSnapshot,
          isOrphanCuration: true,
          curation,
        });
      }
    }

    const filtered = merged.filter((item) =>
      this.matchesFilters(item, filters),
    );
    filtered.sort((a, b) => a.procedureCode.localeCompare(b.procedureCode));

    const count = filtered.length;
    const skip = (params.page - 1) * params.limit;
    const data = filtered.slice(skip, skip + params.limit);

    return { count, data, page: params.page, limit: params.limit };
  }

  private matchesFilters(
    item: EsocialProcedureMergedItem,
    filters: {
      search?: string;
      status?: PcmsoEsocialProcedureStatusEnum;
      technicalType?: BrowseEsocialProceduresQuery['technicalType'];
      isOccupationalRelevant?: boolean;
      onlyCurated?: boolean;
    },
  ): boolean {
    if (filters.search?.trim()) {
      const search = normalize(filters.search.trim());
      const haystack = normalize(
        `${item.procedureCode} ${item.officialName ?? ''}`,
      );
      if (!haystack.includes(search)) return false;
    }

    if (filters.onlyCurated && !item.curation) return false;
    if (filters.status && item.curation?.status !== filters.status) return false;
    if (
      filters.technicalType &&
      item.curation?.technicalType !== filters.technicalType
    ) {
      return false;
    }
    if (
      filters.isOccupationalRelevant !== undefined &&
      (item.curation?.isOccupationalRelevant ?? false) !==
        filters.isOccupationalRelevant
    ) {
      return false;
    }

    return true;
  }

  async getByCode(procedureCode: string): Promise<EsocialProcedureMergedItem> {
    const catalog = await this.repository.getOfficialCatalog();
    const official = catalog.find((item) => item.code === procedureCode) ?? null;
    const curation = await this.repository.findCurationByCode(procedureCode);

    if (!official && !curation) {
      throw new NotFoundException(
        'Procedimento não encontrado na Tabela 27 nem na curadoria.',
      );
    }

    return {
      procedureCode,
      officialName: official?.name ?? curation?.procedureNameSnapshot ?? null,
      isOrphanCuration: !official && Boolean(curation),
      curation: curation ?? null,
    };
  }

  /**
   * Upsert idempotente da curadoria por procedureCode. Nunca altera a Tabela 27
   * oficial: apenas lê o nome para gravar/atualizar o snapshot.
   */
  async upsertByCode(
    procedureCode: string,
    dto: UpsertEsocialProcedureBody,
    userId?: number,
  ) {
    const catalog = await this.repository.getOfficialCatalog();
    const official = catalog.find((item) => item.code === procedureCode);
    if (!official) {
      throw new NotFoundException(
        'Procedimento não encontrado no catálogo oficial da Tabela 27.',
      );
    }

    const existing = await this.repository.findCurationByCode(procedureCode);

    const technicalType =
      dto.technicalType === null ? null : dto.technicalType ?? undefined;
    const internalNotes =
      dto.internalNotes === null ? null : dto.internalNotes ?? undefined;

    if (existing) {
      return this.repository.update(existing.id, {
        procedureNameSnapshot: official.name,
        ...(dto.status !== undefined ? { status: dto.status } : {}),
        ...(dto.isOccupationalRelevant !== undefined
          ? { isOccupationalRelevant: dto.isOccupationalRelevant }
          : {}),
        ...(technicalType !== undefined ? { technicalType } : {}),
        ...(internalNotes !== undefined ? { internalNotes } : {}),
        ...(dto.source !== undefined ? { source: dto.source } : {}),
        ...(userId !== undefined ? { updatedById: userId } : {}),
      });
    }

    return this.repository.create({
      procedureCode,
      procedureNameSnapshot: official.name,
      status: dto.status ?? PcmsoEsocialProcedureStatusEnum.DRAFT,
      isOccupationalRelevant: dto.isOccupationalRelevant ?? false,
      technicalType: technicalType ?? null,
      internalNotes: internalNotes ?? null,
      source: dto.source ?? PcmsoEsocialProcedureSourceEnum.ESOCIAL_TABLE_27,
      createdById: userId ?? null,
      updatedById: userId ?? null,
    });
  }

  async updateStatus(id: string, status: PcmsoEsocialProcedureStatusEnum) {
    await this.ensureCurationExists(id);
    return this.repository.updateStatus(id, status);
  }

  async softDelete(id: string) {
    await this.ensureCurationExists(id);
    return this.repository.softDelete(id);
  }

  private async ensureCurationExists(id: string) {
    const curation = await this.repository.findCurationById(id);
    if (!curation) {
      throw new NotFoundException('Curadoria de procedimento não encontrada.');
    }
    return curation;
  }
}
