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

const masterUser = {
  userId: 1,
  roles: [RoleEnum.MASTER],
} as UserPayloadDto;

describe('ExamRiskRulePublishFromSelectionService', () => {
  let service: ExamRiskRulePublishFromSelectionService;
  let prisma: {
    riskFactors: { findFirst: jest.Mock<any> };
    exam: { findFirst: jest.Mock<any> };
  };
  let ruleRepository: {
    findRuleBySourceAndIndicator: jest.Mock<any>;
    findNr07RuleByAgentAndExam: jest.Mock<any>;
    findAgentRuleByExam: jest.Mock<any>;
    create: jest.Mock<any>;
  };

  beforeEach(() => {
    prisma = {
      riskFactors: { findFirst: jest.fn() },
      exam: { findFirst: jest.fn() },
    };
    ruleRepository = {
      findRuleBySourceAndIndicator: jest.fn<any>().mockResolvedValue(null),
      findNr07RuleByAgentAndExam: jest.fn<any>().mockResolvedValue(null),
      findAgentRuleByExam: jest.fn<any>().mockResolvedValue(null),
      create: jest.fn<any>().mockResolvedValue({ id: 'rule-1' }),
    };
    service = new ExamRiskRulePublishFromSelectionService(
      prisma as unknown as PrismaService,
      ruleRepository as unknown as ExamRiskRuleRepository,
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

  it('creates ACTIVE TECHNICAL AGENT rule for MASTER', async () => {
    prisma.riskFactors.findFirst.mockResolvedValue({
      id: 'risk-1',
      name: 'Heptano',
      cas: '142-82-5',
    });
    prisma.exam.findFirst.mockResolvedValue({
      id: 10,
      name: 'Exame X',
      esocial27Code: '0100',
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

    expect(result.action).toBe('created');
    expect(ruleRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        scope: PcmsoExamRiskRuleScopeEnum.AGENT,
        source: PcmsoExamRiskRuleSourceEnum.TECHNICAL,
        status: PcmsoExamRiskRuleStatusEnum.ACTIVE,
        isCurated: true,
        sourceIndicatorId: 'esocial-t27::risk-1::10',
      }),
    );
  });

  it('returns alreadyExists when esocial rule indicator exists', async () => {
    prisma.riskFactors.findFirst.mockResolvedValue({
      id: 'risk-1',
      name: 'Heptano',
      cas: null,
    });
    prisma.exam.findFirst.mockResolvedValue({
      id: 10,
      name: 'Exame X',
      esocial27Code: '0100',
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

  it('skips when NR-07 equivalent exists', async () => {
    prisma.riskFactors.findFirst.mockResolvedValue({
      id: 'risk-1',
      name: 'Heptano',
      cas: null,
    });
    prisma.exam.findFirst.mockResolvedValue({
      id: 10,
      name: 'Exame X',
      esocial27Code: '0100',
    });
    ruleRepository.findNr07RuleByAgentAndExam.mockResolvedValue({ id: 'nr7-rule' });

    const result = await service.publish(
      { riskFactorId: 'risk-1', examId: 10, companyId: 'company-1' },
      masterUser,
    );

    expect(result).toMatchObject({
      action: 'skipped',
      ruleId: 'nr7-rule',
    });
    expect(ruleRepository.create).not.toHaveBeenCalled();
  });
});
