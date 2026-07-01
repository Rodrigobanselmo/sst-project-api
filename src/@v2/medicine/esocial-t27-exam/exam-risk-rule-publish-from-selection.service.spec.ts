import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { ForbiddenException } from '@nestjs/common';
import {
  PcmsoExamRiskRuleScopeEnum,
  PcmsoExamRiskRuleSourceEnum,
  PcmsoExamRiskRuleStatusEnum,
} from '@prisma/client';

import { ExamRiskRuleRepository } from '@/@v2/medicine/exam-risk-rule/exam-risk-rule.repository';
import { PrismaService } from '@/prisma/prisma.service';
import { RoleEnum } from '@/shared/constants/enum/authorization';
import { UserPayloadDto } from '@/shared/dto/user-payload.dto';

import { ExamRiskRulePublishFromSelectionService } from './exam-risk-rule-publish-from-selection.service';
import { ResolveSystemExamForRulePublicationService } from './resolve-system-exam-for-rule-publication.service';

const masterUser = {
  userId: 1,
  roles: [RoleEnum.MASTER],
} as UserPayloadDto;

describe('ExamRiskRulePublishFromSelectionService', () => {
  let service: ExamRiskRulePublishFromSelectionService;
  let prisma: {
    riskFactors: { findFirst: jest.Mock<any> };
  };
  let ruleRepository: {
    findRuleBySourceAndIndicator: jest.Mock<any>;
    findNr07RuleByAgentAndExam: jest.Mock<any>;
    findAgentRuleByExam: jest.Mock<any>;
    create: jest.Mock<any>;
  };
  let resolveSystemExamService: { resolve: jest.Mock<any> };

  beforeEach(() => {
    prisma = {
      riskFactors: { findFirst: jest.fn() },
    };
    ruleRepository = {
      findRuleBySourceAndIndicator: jest.fn<any>().mockResolvedValue(null),
      findNr07RuleByAgentAndExam: jest.fn<any>().mockResolvedValue(null),
      findAgentRuleByExam: jest.fn<any>().mockResolvedValue(null),
      create: jest.fn<any>().mockResolvedValue({ id: 'rule-1' }),
    };
    resolveSystemExamService = {
      resolve: jest.fn<any>().mockResolvedValue({
        systemExamId: 10,
        systemExamName: 'Exame X',
        esocial27Code: '0100',
        action: 'same',
      }),
    };
    service = new ExamRiskRulePublishFromSelectionService(
      prisma as unknown as PrismaService,
      ruleRepository as unknown as ExamRiskRuleRepository,
      resolveSystemExamService as unknown as ResolveSystemExamForRulePublicationService,
    );
  });

  it('rejects non-MASTER users', async () => {
    await expect(
      service.publish(
        { riskFactorId: 'risk-1', examId: 1, companyId: 'company-1' },
        { userId: 2, roles: [] } as UserPayloadDto,
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('creates ACTIVE TECHNICAL AGENT rule for MASTER using normalized system exam', async () => {
    prisma.riskFactors.findFirst.mockResolvedValue({
      id: 'risk-1',
      name: 'Heptano',
      cas: '142-82-5',
    });

    const result = await service.publish(
      {
        riskFactorId: 'risk-1',
        examId: 10,
        companyId: 'company-1',
        esocial27Code: '0100',
      },
      masterUser,
    );

    expect(resolveSystemExamService.resolve).toHaveBeenCalledWith(10);
    expect(result.action).toBe('created');
    expect(result).toMatchObject({
      systemExamId: 10,
      examPublicationAction: 'same',
    });
    expect(ruleRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        scope: PcmsoExamRiskRuleScopeEnum.AGENT,
        source: PcmsoExamRiskRuleSourceEnum.TECHNICAL,
        status: PcmsoExamRiskRuleStatusEnum.ACTIVE,
        isCurated: true,
        sourceIndicatorId: 'esocial-t27::risk-1::10',
        exams: {
          createMany: {
            data: [expect.objectContaining({ examId: 10, examNameSnapshot: 'Exame X' })],
          },
        },
      }),
    );
  });

  it('publica regra com examId global quando vínculo usa exame local (6 → 70)', async () => {
    prisma.riskFactors.findFirst.mockResolvedValue({
      id: 'risk-benzeno',
      name: 'Benzeno e seus compostos tóxicos. (Agente Insalubre & Nocivo)',
      cas: '71-43-2',
    });
    resolveSystemExamService.resolve.mockResolvedValue({
      systemExamId: 70,
      systemExamName:
        'Hemograma com contagem de plaquetas ou frações (eritrograma, leucograma, plaquetas)',
      esocial27Code: '0693',
      action: 'reusedGlobal',
    });

    const result = await service.publish(
      {
        riskFactorId: 'risk-benzeno',
        examId: 6,
        companyId: 'company-gaia',
      },
      masterUser,
    );

    expect(resolveSystemExamService.resolve).toHaveBeenCalledWith(6);
    expect(result).toMatchObject({
      action: 'created',
      systemExamId: 70,
      examPublicationAction: 'reusedGlobal',
    });
    expect(ruleRepository.findAgentRuleByExam).toHaveBeenCalledWith(
      expect.objectContaining({ examId: 70 }),
    );
    expect(ruleRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        sourceIndicatorId: 'esocial-t27::risk-benzeno::70',
        exams: {
          createMany: {
            data: [
              expect.objectContaining({
                examId: 70,
              }),
            ],
          },
        },
      }),
    );
  });

  it('returns alreadyExists when esocial rule indicator exists for system exam', async () => {
    prisma.riskFactors.findFirst.mockResolvedValue({
      id: 'risk-1',
      name: 'Heptano',
      cas: null,
    });
    ruleRepository.findRuleBySourceAndIndicator.mockResolvedValue({ id: 'existing' });

    const result = await service.publish(
      { riskFactorId: 'risk-1', examId: 10, companyId: 'company-1' },
      masterUser,
    );

    expect(result).toMatchObject({
      action: 'alreadyExists',
      ruleId: 'existing',
    });
    expect(ruleRepository.create).not.toHaveBeenCalled();
  });

  it('skips when NR-07 equivalent exists for system exam', async () => {
    prisma.riskFactors.findFirst.mockResolvedValue({
      id: 'risk-1',
      name: 'Heptano',
      cas: null,
    });
    ruleRepository.findNr07RuleByAgentAndExam.mockResolvedValue({ id: 'nr7-rule' });

    const result = await service.publish(
      { riskFactorId: 'risk-1', examId: 10, companyId: 'company-1' },
      masterUser,
    );

    expect(ruleRepository.findNr07RuleByAgentAndExam).toHaveBeenCalledWith(
      expect.objectContaining({ examId: 10 }),
    );
    expect(result).toMatchObject({
      action: 'skipped',
      ruleId: 'nr7-rule',
    });
    expect(ruleRepository.create).not.toHaveBeenCalled();
  });
});
