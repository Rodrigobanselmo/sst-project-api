import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  PcmsoExamRiskRuleScopeEnum,
  PcmsoExamRiskRuleSourceEnum,
  PcmsoExamRiskRuleStatusEnum,
  Prisma,
  RiskFactorsEnum,
} from '@prisma/client';

import {
  CreateExamRiskRuleBody,
  ExamRiskRuleExamInput,
  UpdateExamRiskRuleBody,
} from './exam-risk-rule.dto';
import {
  resolveExamRiskRuleNormativeOriginLabel,
  resolveExamRiskRuleRiskFactorDisplayName,
} from './exam-risk-rule-riskfactor-display.util';
import {
  parseAcgihOfficialIndicatorId,
  resolveExamRiskRuleSourceDisplay,
} from './exam-risk-rule-source-display.util';
import { ExamRiskRuleRepository } from './exam-risk-rule.repository';

type RuleWithRelations = NonNullable<
  Awaited<ReturnType<ExamRiskRuleRepository['findById']>>
>;

type IndicatorRiskFactorMap = Awaited<
  ReturnType<ExamRiskRuleRepository['findNr07IndicatorRiskFactorsByIds']>
>;

type AcgihBeiOriginMap = Awaited<
  ReturnType<ExamRiskRuleRepository['findAcgihBeiOriginsByOfficialIndicatorIds']>
>;

type ScopeReference = {
  scope: PcmsoExamRiskRuleScopeEnum;
  riskFactorId?: string | null;
  riskCategory?: RiskFactorsEnum | null;
  riskSubTypeId?: number | null;
  agentCas?: string | null;
  agentName?: string | null;
};

const normalizeAgentName = (value?: string | null): string | null => {
  if (!value) return null;
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
};

@Injectable()
export class ExamRiskRuleService {
  constructor(private readonly repository: ExamRiskRuleRepository) {}

  browse(params: Parameters<ExamRiskRuleRepository['browse']>[0]) {
    return this.browseEnriched(params);
  }

  private async browseEnriched(
    params: Parameters<ExamRiskRuleRepository['browse']>[0],
  ) {
    const filters = { ...params.filters };
    const search = filters.search?.trim();

    if (search) {
      filters.nr07SourceIndicatorIds =
        await this.repository.findNr07IndicatorIdsByRiskFactorNameSearch(search);
    }

    const result = await this.repository.browse({ ...params, filters });
    return this.enrichBrowsePage(result);
  }

  async getById(id: string) {
    const rule = await this.repository.findById(id);
    if (!rule) {
      throw new NotFoundException('Regra Exame × Risco não encontrada.');
    }

    let indicatorRiskMap: IndicatorRiskFactorMap | undefined;
    let acgihOriginMap: AcgihBeiOriginMap | undefined;
    if (
      rule.source === PcmsoExamRiskRuleSourceEnum.NR_07 &&
      rule.sourceIndicatorId
    ) {
      indicatorRiskMap =
        await this.repository.findNr07IndicatorRiskFactorsByIds([
          rule.sourceIndicatorId,
        ]);
    }
    if (
      rule.source === PcmsoExamRiskRuleSourceEnum.TECHNICAL &&
      rule.sourceIndicatorId
    ) {
      const officialId = parseAcgihOfficialIndicatorId(rule.sourceIndicatorId);
      if (officialId) {
        acgihOriginMap =
          await this.repository.findAcgihBeiOriginsByOfficialIndicatorIds([
            officialId,
          ]);
      }
    }

    return this.enrichRule(rule, indicatorRiskMap, acgihOriginMap);
  }

  private async enrichBrowsePage(
    result: Awaited<ReturnType<ExamRiskRuleRepository['browse']>>,
  ) {
    const indicatorIds = [
      ...new Set(
        result.data
          .filter(
            (rule) =>
              rule.source === PcmsoExamRiskRuleSourceEnum.NR_07 &&
              rule.sourceIndicatorId,
          )
          .map((rule) => rule.sourceIndicatorId as string),
      ),
    ];

    const acgihOfficialIds = [
      ...new Set(
        result.data
          .filter(
            (rule) =>
              rule.source === PcmsoExamRiskRuleSourceEnum.TECHNICAL &&
              rule.sourceIndicatorId,
          )
          .map((rule) => parseAcgihOfficialIndicatorId(rule.sourceIndicatorId))
          .filter((id): id is string => Boolean(id)),
      ),
    ];

    const [indicatorRiskMap, acgihOriginMap] = await Promise.all([
      this.repository.findNr07IndicatorRiskFactorsByIds(indicatorIds),
      this.repository.findAcgihBeiOriginsByOfficialIndicatorIds(acgihOfficialIds),
    ]);

    return {
      ...result,
      data: result.data.map((rule) =>
        this.enrichRule(rule, indicatorRiskMap, acgihOriginMap),
      ),
    };
  }

  private enrichRule(
    rule: RuleWithRelations,
    indicatorRiskMap?: IndicatorRiskFactorMap,
    acgihOriginMap?: AcgihBeiOriginMap,
  ) {
    const indicatorRiskFactor =
      rule.source === PcmsoExamRiskRuleSourceEnum.NR_07 && rule.sourceIndicatorId
        ? indicatorRiskMap?.get(rule.sourceIndicatorId) ?? null
        : null;

    const displayInput = {
      scope: rule.scope,
      source: rule.source,
      riskFactorId: rule.riskFactorId,
      riskCategory: rule.riskCategory,
      riskSubTypeId: rule.riskSubTypeId,
      agentName: rule.agentName,
      agentCas: rule.agentCas,
      riskNameSnapshot: rule.riskNameSnapshot,
      subTypeNameSnapshot: rule.subTypeNameSnapshot,
      sourceIndicatorId: rule.sourceIndicatorId,
      indicatorRiskFactor,
    };

    const officialIndicatorId =
      rule.source === PcmsoExamRiskRuleSourceEnum.TECHNICAL
        ? parseAcgihOfficialIndicatorId(rule.sourceIndicatorId)
        : null;
    const acgihOrigin =
      officialIndicatorId && acgihOriginMap
        ? acgihOriginMap.get(officialIndicatorId) ?? null
        : null;

    const sourceDisplay = resolveExamRiskRuleSourceDisplay({
      source: rule.source,
      sourceIndicatorId: rule.sourceIndicatorId,
      acgihOrigin,
    });

    return {
      ...rule,
      linkedRiskFactorId:
        indicatorRiskFactor?.riskFactorId ?? rule.riskFactorId ?? null,
      riskFactorDisplayName:
        resolveExamRiskRuleRiskFactorDisplayName(displayInput),
      normativeOriginLabel:
        resolveExamRiskRuleNormativeOriginLabel(displayInput),
      ...sourceDisplay,
    };
  }

  searchRiskCandidates(params: Parameters<ExamRiskRuleRepository['searchRiskCandidates']>[0]) {
    return this.repository.searchRiskCandidates(params);
  }

  searchExamCandidates(params: Parameters<ExamRiskRuleRepository['searchExamCandidates']>[0]) {
    return this.repository.searchExamCandidates(params);
  }

  async create(dto: CreateExamRiskRuleBody, userId?: number) {
    this.assertScopeReference(dto);
    const snapshots = await this.resolveReferenceSnapshots(dto);
    const exams = await this.mapExamsInput(dto.exams);

    const data: Prisma.PcmsoExamRiskRuleCreateInput = {
      scope: dto.scope,
      source: dto.source,
      status: dto.status ?? PcmsoExamRiskRuleStatusEnum.DRAFT,
      rationale: dto.rationale ?? null,
      riskFactorId: dto.scope === PcmsoExamRiskRuleScopeEnum.RISK ? dto.riskFactorId : null,
      riskCategory:
        dto.scope === PcmsoExamRiskRuleScopeEnum.CATEGORY ? dto.riskCategory : null,
      riskSubTypeId:
        dto.scope === PcmsoExamRiskRuleScopeEnum.GROUP ? dto.riskSubTypeId : null,
      agentCas: dto.scope === PcmsoExamRiskRuleScopeEnum.AGENT ? dto.agentCas ?? null : null,
      agentName: dto.scope === PcmsoExamRiskRuleScopeEnum.AGENT ? dto.agentName ?? null : null,
      agentNameNormalized:
        dto.scope === PcmsoExamRiskRuleScopeEnum.AGENT
          ? normalizeAgentName(dto.agentName)
          : null,
      riskNameSnapshot: snapshots.riskNameSnapshot,
      subTypeNameSnapshot: snapshots.subTypeNameSnapshot,
      createdById: userId ?? null,
      ...(exams.length ? { exams: { createMany: { data: exams } } } : {}),
    };

    return this.repository.create(data);
  }

  async update(id: string, dto: UpdateExamRiskRuleBody) {
    const current = await this.getById(id);

    const merged: ScopeReference = {
      scope: dto.scope ?? current.scope,
      riskFactorId:
        dto.riskFactorId !== undefined ? dto.riskFactorId : current.riskFactorId,
      riskCategory:
        dto.riskCategory !== undefined ? dto.riskCategory : current.riskCategory,
      riskSubTypeId:
        dto.riskSubTypeId !== undefined ? dto.riskSubTypeId : current.riskSubTypeId,
      agentCas: dto.agentCas !== undefined ? dto.agentCas : current.agentCas,
      agentName: dto.agentName !== undefined ? dto.agentName : current.agentName,
    };

    this.assertScopeReference(merged);
    const snapshots = await this.resolveReferenceSnapshots(merged);

    const data: Prisma.PcmsoExamRiskRuleUpdateInput = {
      scope: merged.scope,
      riskFactorId:
        merged.scope === PcmsoExamRiskRuleScopeEnum.RISK ? merged.riskFactorId : null,
      riskCategory:
        merged.scope === PcmsoExamRiskRuleScopeEnum.CATEGORY ? merged.riskCategory : null,
      riskSubTypeId:
        merged.scope === PcmsoExamRiskRuleScopeEnum.GROUP ? merged.riskSubTypeId : null,
      agentCas:
        merged.scope === PcmsoExamRiskRuleScopeEnum.AGENT ? merged.agentCas ?? null : null,
      agentName:
        merged.scope === PcmsoExamRiskRuleScopeEnum.AGENT ? merged.agentName ?? null : null,
      agentNameNormalized:
        merged.scope === PcmsoExamRiskRuleScopeEnum.AGENT
          ? normalizeAgentName(merged.agentName)
          : null,
      riskNameSnapshot: snapshots.riskNameSnapshot,
      subTypeNameSnapshot: snapshots.subTypeNameSnapshot,
      // Edição manual pelo MASTER: protege a regra de sobrescrita no re-sync.
      isCurated: true,
      ...(dto.source !== undefined ? { source: dto.source } : {}),
      ...(dto.status !== undefined ? { status: dto.status } : {}),
      ...(dto.rationale !== undefined ? { rationale: dto.rationale } : {}),
    };

    const examsReplacement =
      dto.exams !== undefined ? await this.mapExamsInput(dto.exams) : undefined;

    return this.repository.update(id, data, examsReplacement);
  }

  async updateStatus(id: string, status: PcmsoExamRiskRuleStatusEnum) {
    await this.getById(id);
    return this.repository.updateStatus(id, status);
  }

  async softDelete(id: string) {
    await this.getById(id);
    await this.repository.softDelete(id);
    return { id, deleted: true };
  }

  private assertScopeReference(ref: ScopeReference) {
    const provided: PcmsoExamRiskRuleScopeEnum[] = [];
    if (ref.riskFactorId) provided.push(PcmsoExamRiskRuleScopeEnum.RISK);
    if (ref.riskCategory) provided.push(PcmsoExamRiskRuleScopeEnum.CATEGORY);
    if (ref.riskSubTypeId) provided.push(PcmsoExamRiskRuleScopeEnum.GROUP);
    if (ref.agentCas || ref.agentName) provided.push(PcmsoExamRiskRuleScopeEnum.AGENT);

    const foreignReferences = provided.filter((scope) => scope !== ref.scope);
    if (foreignReferences.length > 0) {
      throw new BadRequestException(
        'Regra ambígua: apenas a referência correspondente ao escopo selecionado pode ser preenchida.',
      );
    }

    switch (ref.scope) {
      case PcmsoExamRiskRuleScopeEnum.RISK:
        if (!ref.riskFactorId) {
          throw new BadRequestException('Escopo RISK exige riskFactorId.');
        }
        break;
      case PcmsoExamRiskRuleScopeEnum.CATEGORY:
        if (!ref.riskCategory) {
          throw new BadRequestException('Escopo CATEGORY exige riskCategory.');
        }
        break;
      case PcmsoExamRiskRuleScopeEnum.GROUP:
        if (!ref.riskSubTypeId) {
          throw new BadRequestException('Escopo GROUP exige riskSubTypeId.');
        }
        break;
      case PcmsoExamRiskRuleScopeEnum.AGENT:
        if (!ref.agentCas && !ref.agentName) {
          throw new BadRequestException('Escopo AGENT exige agentCas ou agentName.');
        }
        break;
      default:
        throw new BadRequestException('Escopo inválido.');
    }
  }

  private async resolveReferenceSnapshots(ref: ScopeReference) {
    let riskNameSnapshot: string | null = null;
    let subTypeNameSnapshot: string | null = null;

    if (ref.scope === PcmsoExamRiskRuleScopeEnum.RISK && ref.riskFactorId) {
      const risk = await this.repository.findRiskById(ref.riskFactorId);
      if (!risk) {
        throw new BadRequestException(
          'Risco informado não encontrado no catálogo global SimpleSST.',
        );
      }
      riskNameSnapshot = risk.name;
    }

    if (ref.scope === PcmsoExamRiskRuleScopeEnum.GROUP && ref.riskSubTypeId) {
      const subType = await this.repository.findSubTypeById(ref.riskSubTypeId);
      if (!subType) {
        throw new BadRequestException('Grupo/subtipo de risco não encontrado.');
      }
      subTypeNameSnapshot = subType.name;
    }

    return { riskNameSnapshot, subTypeNameSnapshot };
  }

  private async mapExamsInput(
    exams?: ExamRiskRuleExamInput[],
  ): Promise<Prisma.PcmsoExamRiskRuleExamCreateManyRuleInput[]> {
    if (!exams?.length) return [];

    return Promise.all(
      exams.map(async (exam) => {
        let examNameSnapshot = exam.examNameSnapshot ?? null;
        if (exam.examId && !examNameSnapshot) {
          const found = await this.repository.findExamById(exam.examId);
          if (!found) {
            throw new BadRequestException(
              `Exame ${exam.examId} não encontrado no catálogo.`,
            );
          }
          examNameSnapshot = found.name;
        }

        return {
          examId: exam.examId ?? null,
          examNameSnapshot,
          isAdmission: exam.isAdmission ?? false,
          isPeriodic: exam.isPeriodic ?? false,
          isChange: exam.isChange ?? false,
          isReturn: exam.isReturn ?? false,
          isDismissal: exam.isDismissal ?? false,
          isMale: exam.isMale ?? true,
          isFemale: exam.isFemale ?? true,
          validityInMonths: exam.validityInMonths ?? null,
          considerBetweenDays: exam.considerBetweenDays ?? null,
          fromAge: exam.fromAge ?? null,
          toAge: exam.toAge ?? null,
          minRiskDegree: exam.minRiskDegree ?? null,
          minRiskDegreeQuantity: exam.minRiskDegreeQuantity ?? null,
        };
      }),
    );
  }
}
