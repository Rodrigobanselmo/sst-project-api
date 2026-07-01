import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import {
  PcmsoExamRiskRuleScopeEnum,
  PcmsoExamRiskRuleSourceEnum,
  PcmsoExamRiskRuleStatusEnum,
  Prisma,
} from '@prisma/client';

import { ExamRiskRuleRepository } from '@/@v2/medicine/exam-risk-rule/exam-risk-rule.repository';
import { PrismaService } from '@/prisma/prisma.service';
import { RoleEnum } from '@/shared/constants/enum/authorization';
import { UserPayloadDto } from '@/shared/dto/user-payload.dto';
import { normalizeAgentName } from '@/shared/utils/agent-normalize.util';

import {
  buildEsocialT27SourceIndicatorId,
  isEsocialT27SourceIndicatorId,
} from './esocial-t27-exam.util';
import { ResolveSystemExamForRulePublicationService } from './resolve-system-exam-for-rule-publication.service';
import { SystemExamPublicationAction } from './resolve-system-exam-for-rule-publication.util';

export type PublishSystemRuleAction = 'created' | 'alreadyExists' | 'skipped';

export type PublishSystemRuleResult = {
  action: PublishSystemRuleAction;
  ruleId?: string;
  reason?: string;
  systemExamId?: number;
  examPublicationAction?: SystemExamPublicationAction;
};

export type PublishSystemRuleInput = {
  riskFactorId: string;
  examId: number;
  companyId: string;
  validityInMonths?: number | null;
  considerBetweenDays?: number | null;
  fromAge?: number | null;
  toAge?: number | null;
  minRiskDegree?: number | null;
  minRiskDegreeQuantity?: number | null;
  isAdmission?: boolean;
  isPeriodic?: boolean;
  isChange?: boolean;
  isReturn?: boolean;
  isDismissal?: boolean;
  isMale?: boolean;
  isFemale?: boolean;
  esocial27Code?: string | null;
};

@Injectable()
export class ExamRiskRulePublishFromSelectionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ruleRepository: ExamRiskRuleRepository,
    private readonly resolveSystemExamService: ResolveSystemExamForRulePublicationService,
  ) {}

  async publish(
    input: PublishSystemRuleInput,
    user: UserPayloadDto,
  ): Promise<PublishSystemRuleResult> {
    if (!user.roles?.includes(RoleEnum.MASTER)) {
      throw new ForbiddenException(
        'Apenas usuários MASTER podem publicar regra padrão na Biblioteca.',
      );
    }

    const riskFactor = await this.prisma.riskFactors.findFirst({
      where: { id: input.riskFactorId, deleted_at: null },
      select: { id: true, name: true, cas: true },
    });

    if (!riskFactor) {
      return {
        action: 'skipped',
        reason: 'Fator de risco não encontrado para publicar regra padrão.',
      };
    }

    const resolvedSystemExam = await this.resolveSystemExamService.resolve(input.examId);
    if (!resolvedSystemExam) {
      return {
        action: 'skipped',
        reason: 'Exame não encontrado para publicar regra padrão.',
      };
    }

    const systemExam = {
      id: resolvedSystemExam.systemExamId,
      name: resolvedSystemExam.systemExamName,
      esocial27Code: resolvedSystemExam.esocial27Code,
    };
    const examPublicationAction = resolvedSystemExam.action;

    const agentName = riskFactor.name?.trim() || null;
    const agentNameNormalized = normalizeAgentName(agentName);
    if (!agentNameNormalized) {
      return {
        action: 'skipped',
        reason: 'Fator de risco sem nome de agente para escopo AGENT.',
      };
    }

    const sourceIndicatorId = buildEsocialT27SourceIndicatorId(
      riskFactor.id,
      systemExam.id,
    );

    const existingByIndicator = await this.ruleRepository.findRuleBySourceAndIndicator(
      PcmsoExamRiskRuleSourceEnum.TECHNICAL,
      sourceIndicatorId,
    );
    if (existingByIndicator) {
      return {
        action: 'alreadyExists',
        ruleId: existingByIndicator.id,
        reason:
          'Regra padrão eSocial T27 já publicada para este fator de risco e exame.',
      };
    }

    const existingNr07 = await this.ruleRepository.findNr07RuleByAgentAndExam({
      agentNameNormalized,
      examId: systemExam.id,
    });
    if (existingNr07) {
      return {
        action: 'skipped',
        ruleId: existingNr07.id,
        reason:
          'Já existe regra NR-7 equivalente para este agente e exame; regra eSocial T27 não foi criada.',
      };
    }

    const existingAgentExam = await this.ruleRepository.findAgentRuleByExam({
      agentNameNormalized,
      examId: systemExam.id,
    });
    if (existingAgentExam) {
      if (existingAgentExam.source === PcmsoExamRiskRuleSourceEnum.NR_07) {
        return {
          action: 'skipped',
          ruleId: existingAgentExam.id,
          reason:
            'Já existe regra NR-7 equivalente para este agente e exame; regra eSocial T27 não foi criada.',
        };
      }

      if (
        existingAgentExam.source === PcmsoExamRiskRuleSourceEnum.TECHNICAL &&
        existingAgentExam.sourceIndicatorId &&
        !isEsocialT27SourceIndicatorId(existingAgentExam.sourceIndicatorId)
      ) {
        return {
          action: 'skipped',
          ruleId: existingAgentExam.id,
          reason:
            'Já existe regra técnica ACGIH/BEI equivalente para este agente e exame; regra eSocial T27 não foi criada.',
        };
      }

      return {
        action: 'alreadyExists',
        ruleId: existingAgentExam.id,
        reason:
          'Já existe regra padrão na Biblioteca para este agente e exame.',
      };
    }

    const rationale = [
      'Criada por curadoria MASTER a partir da Tabela 27/eSocial durante cadastro de exame em empresa.',
      `Empresa origem: ${input.companyId}.`,
      `Usuário MASTER: ${user.userId}.`,
      input.esocial27Code
        ? `Procedimento eSocial T27: ${input.esocial27Code}.`
        : systemExam.esocial27Code
          ? `Procedimento eSocial T27: ${systemExam.esocial27Code}.`
          : null,
    ]
      .filter(Boolean)
      .join(' ');

    const examRow: Prisma.PcmsoExamRiskRuleExamCreateManyRuleInput = {
      examId: systemExam.id,
      examNameSnapshot: systemExam.name,
      isAdmission: input.isAdmission ?? true,
      isPeriodic: input.isPeriodic ?? true,
      isChange: input.isChange ?? true,
      isReturn: input.isReturn ?? false,
      isDismissal: input.isDismissal ?? true,
      isMale: input.isMale ?? true,
      isFemale: input.isFemale ?? true,
      validityInMonths: input.validityInMonths ?? null,
      considerBetweenDays: input.considerBetweenDays ?? null,
      fromAge: input.fromAge ?? null,
      toAge: input.toAge ?? null,
      minRiskDegree: input.minRiskDegree ?? null,
      minRiskDegreeQuantity: input.minRiskDegreeQuantity ?? null,
    };

    const created = await this.ruleRepository.create({
      scope: PcmsoExamRiskRuleScopeEnum.AGENT,
      source: PcmsoExamRiskRuleSourceEnum.TECHNICAL,
      sourceIndicatorId,
      status: PcmsoExamRiskRuleStatusEnum.ACTIVE,
      rationale,
      agentCas: riskFactor.cas?.trim() || null,
      agentName,
      agentNameNormalized,
      riskNameSnapshot: riskFactor.name,
      isCurated: true,
      createdById: user.userId,
      exams: { createMany: { data: [examRow] } },
    });

    return {
      action: 'created',
      ruleId: created.id,
      reason: 'Regra padrão publicada na Biblioteca Risco × Exame.',
      systemExamId: systemExam.id,
      examPublicationAction,
    };
  }
}
