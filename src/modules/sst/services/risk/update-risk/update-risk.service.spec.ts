import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { GLOBAL_CATALOG_RISK_FORBIDDEN_MESSAGE } from '../../../shared/risk-factor-catalog-scope.util';
import { RiskRepository } from '../../../repositories/implementations/RiskRepository';
import { UpdateRiskService } from './update-risk.service';

describe('UpdateRiskService', () => {
  let service: UpdateRiskService;
  let riskRepository: jest.Mocked<Pick<RiskRepository, 'findOneById' | 'update'>>;

  const baseUser = {
    isSystem: false,
    targetCompanyId: 'company-a',
    companyId: 'company-a',
  } as any;

  beforeEach(async () => {
    riskRepository = {
      findOneById: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateRiskService,
        { provide: RiskRepository, useValue: riskRepository },
      ],
    }).compile();

    service = module.get(UpdateRiskService);
  });

  it('blocks non-system user from updating global catalog risk', async () => {
    riskRepository.findOneById.mockResolvedValue({
      id: 'risk-1',
      system: true,
      representAll: false,
    } as any);

    await expect(
      service.execute('risk-1', { name: 'Updated' } as any, baseUser),
    ).rejects.toThrow(
      new ForbiddenException(GLOBAL_CATALOG_RISK_FORBIDDEN_MESSAGE),
    );

    expect(riskRepository.update).not.toHaveBeenCalled();
  });

  it('blocks non-system user from updating representAll catalog risk', async () => {
    riskRepository.findOneById.mockResolvedValue({
      id: 'risk-2',
      system: false,
      representAll: true,
    } as any);

    await expect(
      service.execute('risk-2', { name: 'Updated' } as any, baseUser),
    ).rejects.toThrow(ForbiddenException);
  });

  it('allows system user to update global catalog risk', async () => {
    riskRepository.findOneById.mockResolvedValue({
      id: 'risk-1',
      system: true,
      representAll: false,
    } as any);
    riskRepository.update.mockResolvedValue({ id: 'risk-1' } as any);

    const result = await service.execute(
      'risk-1',
      { name: 'Updated' } as any,
      { ...baseUser, isSystem: true },
    );

    expect(result.id).toBe('risk-1');
    expect(riskRepository.update).toHaveBeenCalled();
  });

  it('allows non-system user to update company-owned risk', async () => {
    riskRepository.findOneById.mockResolvedValue({
      id: 'risk-3',
      system: false,
      representAll: false,
    } as any);
    riskRepository.update.mockResolvedValue({ id: 'risk-3' } as any);

    const result = await service.execute(
      'risk-3',
      { name: 'Updated' } as any,
      baseUser,
    );

    expect(result.id).toBe('risk-3');
    expect(riskRepository.update).toHaveBeenCalled();
  });
});
