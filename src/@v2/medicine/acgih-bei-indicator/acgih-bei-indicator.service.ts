import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  PcmsoAcgihBeiIndicator,
  PcmsoAcgihBeiIndicatorSourceEnum,
  PcmsoAcgihBeiIndicatorStatusEnum,
} from '@prisma/client';

import {
  BrowseAcgihBeiIndicatorsQuery,
  CreateAcgihBeiIndicatorBody,
  UpdateAcgihBeiIndicatorBody,
} from './acgih-bei-indicator.dto';
import { AcgihBeiIndicatorRepository } from './acgih-bei-indicator.repository';
import { buildDedupeKey, normalizeText } from './acgih-bei-indicator-import.util';

@Injectable()
export class AcgihBeiIndicatorService {
  constructor(private readonly repository: AcgihBeiIndicatorRepository) {}

  browse(params: {
    page: number;
    limit: number;
    filters?: BrowseAcgihBeiIndicatorsQuery;
  }) {
    return this.repository.browse({
      page: params.page,
      limit: params.limit,
      filters: {
        search: params.filters?.search,
        biologicalMatrix: params.filters?.biologicalMatrix,
        status: params.filters?.status,
        confidence: params.filters?.confidence,
        source: params.filters?.source,
        onlyCurated: params.filters?.onlyCurated,
      },
    });
  }

  async getById(id: string): Promise<PcmsoAcgihBeiIndicator> {
    const indicator = await this.repository.findById(id);
    if (!indicator) {
      throw new NotFoundException('Indicador ACGIH/BEI não encontrado.');
    }
    return indicator;
  }

  async create(dto: CreateAcgihBeiIndicatorBody, userId?: number) {
    const dedupeKey = buildDedupeKey({
      substanceName: dto.substanceName,
      cas: dto.cas,
      determinant: dto.determinant,
      biologicalMatrix: dto.biologicalMatrix,
      samplingTime: dto.samplingTime,
    });

    await this.ensureDedupeKeyFree(dedupeKey);

    return this.repository.create({
      substanceName: dto.substanceName,
      substanceNameNormalized: normalizeText(dto.substanceName),
      cas: dto.cas ?? null,
      referenceYear: dto.referenceYear ?? null,
      determinant: dto.determinant ?? null,
      biologicalMatrix: dto.biologicalMatrix ?? null,
      samplingTime: dto.samplingTime ?? null,
      beiValue: dto.beiValue ?? null,
      unit: dto.unit ?? null,
      notation: dto.notation ?? null,
      status: dto.status ?? PcmsoAcgihBeiIndicatorStatusEnum.DRAFT,
      source: dto.source ?? PcmsoAcgihBeiIndicatorSourceEnum.ACGIH_BEI,
      sourceYear: dto.sourceYear ?? null,
      isCurated: dto.isCurated ?? false,
      confidence: dto.confidence ?? null,
      internalNotes: dto.internalNotes ?? null,
      sourcePage: dto.sourcePage ?? null,
      dedupeKey,
      createdById: userId ?? null,
      updatedById: userId ?? null,
    });
  }

  async update(id: string, dto: UpdateAcgihBeiIndicatorBody, userId?: number) {
    const existing = await this.getById(id);

    const next = {
      substanceName: dto.substanceName ?? existing.substanceName,
      cas: dto.cas !== undefined ? dto.cas : existing.cas,
      determinant:
        dto.determinant !== undefined ? dto.determinant : existing.determinant,
      biologicalMatrix:
        dto.biologicalMatrix !== undefined
          ? dto.biologicalMatrix
          : existing.biologicalMatrix,
      samplingTime:
        dto.samplingTime !== undefined
          ? dto.samplingTime
          : existing.samplingTime,
    };

    const dedupeKey = buildDedupeKey(next);
    if (dedupeKey !== existing.dedupeKey) {
      await this.ensureDedupeKeyFree(dedupeKey, id);
    }

    return this.repository.update(id, {
      ...(dto.substanceName !== undefined
        ? {
            substanceName: dto.substanceName,
            substanceNameNormalized: normalizeText(dto.substanceName),
          }
        : {}),
      ...(dto.cas !== undefined ? { cas: dto.cas } : {}),
      ...(dto.referenceYear !== undefined
        ? { referenceYear: dto.referenceYear }
        : {}),
      ...(dto.determinant !== undefined
        ? { determinant: dto.determinant }
        : {}),
      ...(dto.biologicalMatrix !== undefined
        ? { biologicalMatrix: dto.biologicalMatrix }
        : {}),
      ...(dto.samplingTime !== undefined
        ? { samplingTime: dto.samplingTime }
        : {}),
      ...(dto.beiValue !== undefined ? { beiValue: dto.beiValue } : {}),
      ...(dto.unit !== undefined ? { unit: dto.unit } : {}),
      ...(dto.notation !== undefined ? { notation: dto.notation } : {}),
      ...(dto.status !== undefined ? { status: dto.status } : {}),
      ...(dto.source !== undefined ? { source: dto.source } : {}),
      ...(dto.sourceYear !== undefined ? { sourceYear: dto.sourceYear } : {}),
      ...(dto.isCurated !== undefined ? { isCurated: dto.isCurated } : {}),
      ...(dto.confidence !== undefined ? { confidence: dto.confidence } : {}),
      ...(dto.internalNotes !== undefined
        ? { internalNotes: dto.internalNotes }
        : {}),
      ...(dto.sourcePage !== undefined ? { sourcePage: dto.sourcePage } : {}),
      dedupeKey,
      updatedById: userId ?? null,
    });
  }

  async updateStatus(id: string, status: PcmsoAcgihBeiIndicatorStatusEnum) {
    await this.getById(id);
    return this.repository.updateStatus(id, status);
  }

  async softDelete(id: string) {
    await this.getById(id);
    return this.repository.softDelete(id);
  }

  private async ensureDedupeKeyFree(dedupeKey: string, exceptId?: string) {
    const matches = await this.repository.findByDedupeKeys([dedupeKey]);
    const conflict = matches.find(
      (item) => item.deleted_at === null && item.id !== exceptId,
    );
    if (conflict) {
      throw new ConflictException(
        'Já existe um indicador ACGIH/BEI com a mesma combinação substância/CAS/determinante/matriz/momento.',
      );
    }
  }
}
