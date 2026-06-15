import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';

import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { IStorageAdapter } from '@/@v2/shared/adapters/storage/storage.interface';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { RoleEnum } from '@/shared/constants/enum/authorization';
import { UserPayloadDto } from '@/shared/dto/user-payload.dto';

import {
  HO_METHOD_CHEMICAL_ONLY_MESSAGE,
  HO_METHOD_CHEMICAL_RISK_TYPE,
} from './utils/ho-method-chemical.util';
import { buildDefaultDisplayName } from './ho-method.mapper';
import { HoMethodDAO } from './ho-method.dao';
import { HoMethodRepository } from './ho-method.repository';
import {
  HoMethodAgentInput,
  HoMethodBrowseFilters,
  HoMethodEvaluationConditionInput,
  HoMethodLaboratoryInput,
  HoMethodRecord,
  HoMethodWriteInput,
} from './ho-method.types';

@Injectable()
export class HoMethodService {
  constructor(
    private readonly hoMethodDAO: HoMethodDAO,
    private readonly hoMethodRepository: HoMethodRepository,
    private readonly prisma: PrismaServiceV2,
    @Inject(SharedTokens.Storage)
    private readonly storage: IStorageAdapter,
  ) {}

  browse(params: {
    page?: number;
    limit?: number;
    filters?: HoMethodBrowseFilters;
  }) {
    return this.hoMethodDAO.browse(params);
  }

  async read(id: string) {
    const record = await this.hoMethodDAO.findById(id);
    if (!record) {
      throw new NotFoundException('Método de HO não encontrado.');
    }

    return record;
  }

  async streamOriginalDocument(id: string, res: Response) {
    const file = await this.hoMethodDAO.findDocumentFile(id);
    if (!file) {
      throw new NotFoundException('Documento original não encontrado.');
    }

    const stream = await this.storage.download({
      fileKey: file.key,
      bucket: file.bucket,
    });

    res.setHeader(
      'Content-Type',
      'application/pdf',
    );
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${encodeURIComponent(file.fallbackName)}"`,
    );

    stream.pipe(res);
  }

  async create(input: HoMethodWriteInput) {
    const normalized = await this.normalizeInput(input);
    await this.ensureUnique(normalized);

    const record = await this.hoMethodRepository.create(normalized);
    return (await this.hoMethodDAO.findById(record.id)) ?? record;
  }

  async update(id: string, input: HoMethodWriteInput, user: UserPayloadDto) {
    const existing = await this.read(id);
    this.assertDocumentReplaceAllowed(user, existing, input);

    const normalized = await this.normalizeInput(input);
    await this.ensureUnique(normalized, id);

    await this.hoMethodRepository.update(id, normalized);
    return (await this.hoMethodDAO.findById(id))!;
  }

  async remove(id: string) {
    await this.read(id);
    return this.hoMethodRepository.softDelete(id);
  }

  private assertDocumentReplaceAllowed(
    user: UserPayloadDto & { isMaster?: boolean },
    existing: HoMethodRecord,
    input: HoMethodWriteInput,
  ) {
    if (!existing.originalDocumentFileId) return;

    const nextFileId = input.originalDocumentFileId ?? null;
    const fileChanged = nextFileId !== existing.originalDocumentFileId;
    const nameChanged =
      (input.originalDocumentName?.trim() || null) !==
      (existing.originalDocumentName?.trim() || null);
    const uploadedAtChanged =
      (input.originalDocumentUploadedAt?.toISOString?.() ?? null) !==
      (existing.originalDocumentUploadedAt ?? null);

    if (!fileChanged && !nameChanged && !uploadedAtChanged) return;

    const isMasterUser =
      Boolean(user?.isMaster) ||
      user?.roles?.includes(RoleEnum.MASTER) === true;

    if (!isMasterUser) {
      throw new ForbiddenException(
        'Somente usuários master podem substituir o documento original do método.',
      );
    }
  }

  private async normalizeInput(
    input: HoMethodWriteInput,
  ): Promise<HoMethodWriteInput> {
    const methodCode = input.methodCode?.trim();
    const institution = input.institution;

    if (!methodCode) {
      throw new BadRequestException('Código do método é obrigatório.');
    }

    const agents = this.resolveAgents(input);
    if (!agents.length) {
      throw new BadRequestException(
        'Adicione pelo menos um agente químico cadastrado ao método de HO.',
      );
    }

    await this.assertChemicalAgentsOnly(agents);

    for (const agent of agents) {
      if (!agent.evaluationConditions?.length) {
        throw new BadRequestException(
          'Selecione pelo menos uma condição de avaliação para o agente químico vinculado.',
        );
      }
    }

    const primaryAgent = agents[0];

    const displayName =
      input.displayName?.trim() ||
      buildDefaultDisplayName({
        institution,
        methodCode,
      });

    if (
      input.minimumFlowRate != null &&
      input.maximumFlowRate != null &&
      input.minimumFlowRate > input.maximumFlowRate
    ) {
      throw new BadRequestException(
        'Vazão mínima permitida não pode ser maior que a vazão máxima.',
      );
    }

    if (
      input.minimumVolume != null &&
      input.maximumVolume != null &&
      input.minimumVolume > input.maximumVolume
    ) {
      throw new BadRequestException(
        'Volume mínimo permitido não pode ser maior que o volume máximo.',
      );
    }

    const laboratories = await this.resolveLaboratories(input.laboratories ?? []);

    return {
      ...input,
      displayName,
      methodCode,
      description: input.description?.trim() || null,
      agentName: primaryAgent.agentName?.trim() || null,
      cas: primaryAgent.cas?.trim() || null,
      riskFactorId: primaryAgent.riskFactorId,
      agentType: 'CHEMICAL' as const,
      flowRateUnit: input.flowRateUnit?.trim() || null,
      volumeUnit: input.volumeUnit?.trim() || null,
      storageTemperatureUnit: this.normalizeTemperatureUnit(
        input.storageTemperatureUnit,
      ),
      originalDocumentName: input.originalDocumentName?.trim() || null,
      notes: input.notes?.trim() || null,
      agents: agents.map((agent) => ({
        ...agent,
        agentName: agent.agentName?.trim() || null,
        cas: agent.cas?.trim() || null,
        unit: agent.unit?.trim() || null,
        agentType: 'CHEMICAL',
        evaluationConditions: this.normalizeEvaluationConditions(
          agent.evaluationConditions ?? [],
        ),
      })),
      evaluationConditions: [],
      laboratories,
    };
  }

  private async resolveLaboratories(
    laboratories: HoMethodLaboratoryInput[],
  ): Promise<HoMethodLaboratoryInput[]> {
    const resolved: HoMethodLaboratoryInput[] = [];

    for (const lab of laboratories) {
      if (lab.laboratoryId) {
        const catalogLab = await this.prisma.hoLaboratory.findFirst({
          where: {
            id: lab.laboratoryId,
            deleted_at: null,
            status: 'ACTIVE',
          },
        });

        if (!catalogLab) {
          throw new BadRequestException(
            'Laboratório selecionado não encontrado ou inativo.',
          );
        }

        resolved.push({
          ...lab,
          laboratoryId: catalogLab.id,
          laboratoryName:
            catalogLab.tradeName?.trim() ||
            catalogLab.corporateName.trim(),
          notes: lab.notes?.trim() || null,
          analyticalNotes: lab.analyticalNotes?.trim() || null,
          storageTemperatureUnitOverride: this.normalizeTemperatureUnit(
            lab.storageTemperatureUnitOverride,
          ),
        });
        continue;
      }

      const legacyName = lab.laboratoryName?.trim();
      if (!legacyName) continue;

      resolved.push({
        ...lab,
        laboratoryName: legacyName,
        notes: lab.notes?.trim() || null,
        analyticalNotes: lab.analyticalNotes?.trim() || null,
        storageTemperatureUnitOverride: this.normalizeTemperatureUnit(
          lab.storageTemperatureUnitOverride,
        ),
      });
    }

    return resolved;
  }

  private async assertChemicalAgentsOnly(agents: HoMethodAgentInput[]) {
    const riskIds = [...new Set(agents.map((agent) => agent.riskFactorId))];

    const risks = await this.prisma.riskFactors.findMany({
      where: {
        id: { in: riskIds },
        deleted_at: null,
        status: 'ACTIVE',
        type: HO_METHOD_CHEMICAL_RISK_TYPE,
      },
      select: { id: true },
    });

    if (risks.length !== riskIds.length) {
      throw new BadRequestException(HO_METHOD_CHEMICAL_ONLY_MESSAGE);
    }
  }

  private normalizeTemperatureUnit(value?: string | null) {
    const normalized = value?.trim();
    if (normalized === '°F' || normalized?.toUpperCase() === 'F') {
      return '°F';
    }
    return '°C';
  }

  private resolveAgents(input: HoMethodWriteInput): HoMethodAgentInput[] {
    if (input.agents?.length) {
      return input.agents.filter((agent) => Boolean(agent.riskFactorId));
    }

    if (!input.riskFactorId) return [];

    return [
      {
        riskFactorId: input.riskFactorId,
        agentName: input.agentName ?? null,
        cas: input.cas ?? null,
        agentType: input.agentType,
        evaluationConditions: input.evaluationConditions ?? [],
      },
    ];
  }

  private normalizeEvaluationConditions(
    conditions: HoMethodEvaluationConditionInput[],
  ) {
    const unique = new Map<string, HoMethodEvaluationConditionInput>();

    for (const condition of conditions) {
      unique.set(condition.evaluationType, {
        ...condition,
        limitValue: condition.limitValue?.trim() || null,
        limitUnit: condition.limitUnit?.trim() || null,
        flowRateUnit: condition.flowRateUnit?.trim() || null,
        volumeUnit: condition.volumeUnit?.trim() || null,
        notes: condition.notes?.trim() || null,
      });
    }

    return Array.from(unique.values());
  }

  private async ensureUnique(input: HoMethodWriteInput, excludeId?: string) {
    const exists = await this.hoMethodDAO.existsDuplicate({
      institution: input.institution,
      methodCode: input.methodCode,
      methodVersion: input.methodVersion,
      excludeId,
    });

    if (exists) {
      throw new BadRequestException(
        'Já existe um método de HO com a mesma instituição, código e versão.',
      );
    }
  }
}
