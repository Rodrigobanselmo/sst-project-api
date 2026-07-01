import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { BadRequestException } from '@nestjs/common';
import { RiskFactorsEnum, StatusEnum } from '@prisma/client';

import { RiskSubTypeLinkValidator } from './risk-sub-type-link.validator';

describe('RiskSubTypeLinkValidator', () => {
  let validator: RiskSubTypeLinkValidator;
  let findMany: ReturnType<typeof jest.fn>;

  beforeEach(() => {
    findMany = jest.fn();
    validator = new RiskSubTypeLinkValidator({
      riskSubType: { findMany },
    } as never);
  });

  it('7. cria risco QUI com subtipo QUI válido', async () => {
    findMany.mockImplementation(() =>
      Promise.resolve([
        {
          id: 10,
          type: RiskFactorsEnum.QUI,
          status: StatusEnum.ACTIVE,
          name: 'Solventes',
        },
      ]),
    );

    await expect(
      validator.assertValidLinks(RiskFactorsEnum.QUI, [10]),
    ).resolves.toBeUndefined();
  });

  it('8. cria risco QUI com subtipo ERG falha', async () => {
    findMany.mockImplementation(() =>
      Promise.resolve([
        {
          id: 1,
          type: RiskFactorsEnum.ERG,
          status: StatusEnum.ACTIVE,
          name: 'Psicossociais',
        },
      ]),
    );

    await expect(
      validator.assertValidLinks(RiskFactorsEnum.QUI, [1]),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('6. browse não vincula subtipo INACTIVE', async () => {
    findMany.mockImplementation(() =>
      Promise.resolve([
        {
          id: 2,
          type: RiskFactorsEnum.QUI,
          status: StatusEnum.INACTIVE,
          name: 'Inativo',
        },
      ]),
    );

    await expect(
      validator.assertValidLinks(RiskFactorsEnum.QUI, [2]),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('subtipo inexistente falha', async () => {
    findMany.mockImplementation(() => Promise.resolve([]));

    await expect(
      validator.assertValidLinks(RiskFactorsEnum.ERG, [999]),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('subTypesIds vazio não valida', async () => {
    await expect(
      validator.assertValidLinks(RiskFactorsEnum.QUI, []),
    ).resolves.toBeUndefined();
    expect(findMany).not.toHaveBeenCalled();
  });
});
