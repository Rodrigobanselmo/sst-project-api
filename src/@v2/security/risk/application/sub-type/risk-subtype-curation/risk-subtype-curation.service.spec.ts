import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RiskFactorsEnum, StatusEnum } from '@prisma/client';

import { RiskSubtypeCurationService } from './risk-subtype-curation.service';
import { RiskSubtypeCurationFilterEnum } from './risk-subtype-curation.types';

describe('RiskSubtypeCurationService', () => {
  let service: RiskSubtypeCurationService;
  let repository: {
    browseRisks: ReturnType<typeof jest.fn>;
    findSubTypeById: ReturnType<typeof jest.fn>;
    findGlobalRisksByIds: ReturnType<typeof jest.fn>;
    replaceRiskSubTypes: ReturnType<typeof jest.fn>;
    clearRiskSubTypes: ReturnType<typeof jest.fn>;
    countRiskFactorDataByRiskIds: ReturnType<typeof jest.fn>;
  };

  beforeEach(() => {
    repository = {
      browseRisks: jest.fn(),
      findSubTypeById: jest.fn(),
      findGlobalRisksByIds: jest.fn(),
      replaceRiskSubTypes: jest.fn(() => Promise.resolve([])),
      clearRiskSubTypes: jest.fn(() => Promise.resolve({ count: 1 })),
      countRiskFactorDataByRiskIds: jest.fn(),
    };
    service = new RiskSubtypeCurationService(repository as never);
  });

  it('1. lista riscos globais QUI', async () => {
    repository.browseRisks.mockImplementation(() =>
      Promise.resolve({
        results: [{ riskFactorId: 'r1', type: 'QUI' }],
        pagination: { page: 1, limit: 20, total: 1 },
      }),
    );

    const result = await service.browseRisks({
      type: 'QUI' as never,
      page: 1,
      limit: 20,
    });

    expect(repository.browseRisks).toHaveBeenCalledWith(
      expect.objectContaining({
        filters: expect.objectContaining({ type: 'QUI' }),
      }),
    );
    expect(result.results).toHaveLength(1);
  });

  it('2. filtra riscos sem subtipo', async () => {
    await service.browseRisks({
      type: 'QUI' as never,
      subtypeFilter: RiskSubtypeCurationFilterEnum.NONE,
      page: 1,
      limit: 20,
    });

    expect(repository.browseRisks).toHaveBeenCalledWith(
      expect.objectContaining({
        filters: expect.objectContaining({
          subtypeFilter: RiskSubtypeCurationFilterEnum.NONE,
        }),
      }),
    );
  });

  it('3. filtra por subtipo específico', async () => {
    await service.browseRisks({
      subtypeFilter: RiskSubtypeCurationFilterEnum.SPECIFIC,
      subtypeId: 8,
      page: 1,
      limit: 20,
    });

    expect(repository.browseRisks).toHaveBeenCalledWith(
      expect.objectContaining({
        filters: expect.objectContaining({
          subtypeFilter: RiskSubtypeCurationFilterEnum.SPECIFIC,
          subtypeId: 8,
        }),
      }),
    );
  });

  it('4. bulk assign subtipo QUI em riscos QUI', async () => {
    repository.findSubTypeById.mockImplementation(() =>
      Promise.resolve({
        id: 8,
        name: 'Solventes',
        type: RiskFactorsEnum.QUI,
        status: StatusEnum.ACTIVE,
      }),
    );
    repository.findGlobalRisksByIds.mockImplementation(() =>
      Promise.resolve([
        { id: 'r1', name: 'R1', type: RiskFactorsEnum.QUI },
        { id: 'r2', name: 'R2', type: RiskFactorsEnum.QUI },
      ]),
    );

    const result = await service.bulkAssign({
      riskFactorIds: ['r1', 'r2'],
      subTypeId: 8,
    });

    expect(result.updated).toBe(2);
    expect(repository.replaceRiskSubTypes).toHaveBeenCalledTimes(2);
    expect(repository.countRiskFactorDataByRiskIds).not.toHaveBeenCalled();
  });

  it('5. bulk assign subtipo QUI em risco FIS → skip', async () => {
    repository.findSubTypeById.mockImplementation(() =>
      Promise.resolve({
        id: 8,
        type: RiskFactorsEnum.QUI,
        status: StatusEnum.ACTIVE,
        name: 'Solventes',
      }),
    );
    repository.findGlobalRisksByIds.mockImplementation(() =>
      Promise.resolve([{ id: 'r1', name: 'R1', type: RiskFactorsEnum.FIS }]),
    );

    const result = await service.bulkAssign({
      riskFactorIds: ['r1'],
      subTypeId: 8,
    });

    expect(result.updated).toBe(0);
    expect(result.skipped).toBe(1);
    expect(repository.replaceRiskSubTypes).not.toHaveBeenCalled();
  });

  it('6. bulk clear remove vínculo', async () => {
    repository.findGlobalRisksByIds.mockImplementation(() =>
      Promise.resolve([{ id: 'r1', name: 'R1', type: RiskFactorsEnum.QUI }]),
    );

    const result = await service.bulkClear({ riskFactorIds: ['r1'] });

    expect(result.updated).toBe(1);
    expect(repository.clearRiskSubTypes).toHaveBeenCalledWith('r1');
  });

  it('9. subtipo INACTIVE não pode ser aplicado', async () => {
    repository.findSubTypeById.mockImplementation(() =>
      Promise.resolve({
        id: 8,
        type: RiskFactorsEnum.QUI,
        status: StatusEnum.INACTIVE,
        name: 'Inativo',
      }),
    );

    await expect(
      service.bulkAssign({ riskFactorIds: ['r1'], subTypeId: 8 }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('subtipo inexistente retorna 404', async () => {
    repository.findSubTypeById.mockImplementation(() => Promise.resolve(null));

    await expect(
      service.bulkAssign({ riskFactorIds: ['r1'], subTypeId: 999 }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
