import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { BadRequestException, ForbiddenException } from '@nestjs/common';

import { UpdateExamRiskService } from './update-exam.service';

const masterUser = {
  userId: 1,
  companyId: 'company-1',
  targetCompanyId: 'company-1',
  roles: ['master'],
} as never;

const regularUser = {
  userId: 2,
  companyId: 'company-1',
  targetCompanyId: 'company-1',
  roles: [],
} as never;

describe('UpdateExamRiskService', () => {
  let service: UpdateExamRiskService;
  let examRiskRepository: {
    findFirstNude: jest.Mock<any>;
    update: jest.Mock<any>;
  };
  let publishSystemRuleService: { publish: jest.Mock<any> };
  let checkEmployeeExamService: { execute: jest.Mock<any> };
  let createExamRiskService: { execute: jest.Mock<any> };

  beforeEach(() => {
    examRiskRepository = {
      findFirstNude: jest.fn().mockResolvedValue({
        id: 10,
        riskId: 'risk-1',
        company: { applyingServiceContracts: [] },
      } as never),
      update: jest.fn().mockResolvedValue({
        id: 10,
        riskId: 'risk-1',
        examId: 22,
      } as never),
    };
    publishSystemRuleService = {
      publish: jest.fn().mockResolvedValue({
        action: 'created',
        ruleId: 'rule-1',
      } as never),
    };
    checkEmployeeExamService = {
      execute: jest.fn().mockResolvedValue(undefined as never),
    };
    createExamRiskService = {
      execute: jest.fn(),
    };

    service = new UpdateExamRiskService(
      createExamRiskService as never,
      examRiskRepository as never,
      checkEmployeeExamService as never,
      publishSystemRuleService as never,
    );
  });

  it('MASTER edita vínculo com publishAsSystemRule=true e publica regra padrão', async () => {
    const result = await service.execute(
      10,
      {
        riskId: 'risk-1',
        examId: 22,
        realCompanyId: 'company-1',
        publishAsSystemRule: true,
      },
      masterUser,
    );

    expect(examRiskRepository.update).toHaveBeenCalled();
    expect(publishSystemRuleService.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        riskFactorId: 'risk-1',
        examId: 22,
        companyId: 'company-1',
      }),
      masterUser,
    );
    expect(result).toMatchObject({
      id: 10,
      systemRule: { action: 'created', ruleId: 'rule-1' },
    });
  });

  it('edição sem publishAsSystemRule não publica regra', async () => {
    const result = await service.execute(
      10,
      {
        riskId: 'risk-1',
        examId: 22,
        realCompanyId: 'company-1',
      },
      masterUser,
    );

    expect(publishSystemRuleService.publish).not.toHaveBeenCalled();
    expect(result).not.toHaveProperty('systemRule');
  });

  it('não MASTER com publishAsSystemRule=true é bloqueado pelo serviço de publicação', async () => {
    publishSystemRuleService.publish.mockRejectedValue(
      new ForbiddenException('Apenas usuários MASTER podem publicar regra padrão na Biblioteca.'),
    );

    await expect(
      service.execute(
        10,
        {
          riskId: 'risk-1',
          examId: 22,
          realCompanyId: 'company-1',
          publishAsSystemRule: true,
        },
        regularUser,
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('MASTER repete publicação e retorna alreadyExists', async () => {
    publishSystemRuleService.publish.mockResolvedValue({
      action: 'alreadyExists',
      ruleId: 'rule-existing',
      reason: 'Já existe regra padrão na Biblioteca para este agente e exame.',
    } as never);

    const result = await service.execute(
      10,
      {
        riskId: 'risk-1',
        examId: 22,
        realCompanyId: 'company-1',
        publishAsSystemRule: true,
      },
      masterUser,
    );

    expect(result.systemRule).toMatchObject({
      action: 'alreadyExists',
      ruleId: 'rule-existing',
    });
  });

  it('lança BadRequestException quando vínculo não existe', async () => {
    examRiskRepository.findFirstNude.mockResolvedValue(null as never);

    await expect(
      service.execute(999, { riskId: 'risk-1', examId: 22, realCompanyId: 'company-1' }, masterUser),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
