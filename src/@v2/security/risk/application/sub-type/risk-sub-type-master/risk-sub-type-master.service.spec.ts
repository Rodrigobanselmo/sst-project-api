import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RiskFactorsEnum, StatusEnum } from '@prisma/client';

import { RiskTypeEnum } from '@/@v2/shared/domain/enum/security/risk-type.enum';

import { RiskSubTypeMasterService } from './risk-sub-type-master.service';

describe('RiskSubTypeMasterService', () => {
  let service: RiskSubTypeMasterService;
  let repository: {
    browse: ReturnType<typeof jest.fn>;
    findById: ReturnType<typeof jest.fn>;
    findByTypeAndSlug: ReturnType<typeof jest.fn>;
    create: ReturnType<typeof jest.fn>;
    update: ReturnType<typeof jest.fn>;
  };

  beforeEach(() => {
    repository = {
      browse: jest.fn(),
      findById: jest.fn(),
      findByTypeAndSlug: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
    service = new RiskSubTypeMasterService(repository as never);
  });

  it('2. cria subtipo QUI com sub_type=null', async () => {
    repository.findByTypeAndSlug.mockImplementation(() => Promise.resolve(null));
    repository.create.mockImplementation((data) =>
      Promise.resolve({
        id: 10,
        ...(data as object),
      }),
    );

    await service.create({ name: 'Solventes', type: RiskTypeEnum.QUI }, 99);

    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Solventes',
        slug: 'solventes',
        type: RiskTypeEnum.QUI,
        sub_type: null,
        system: false,
        status: StatusEnum.ACTIVE,
        createdById: 99,
      }),
    );
  });

  it('3. não permite duplicidade de slug no mesmo type', async () => {
    repository.findByTypeAndSlug.mockImplementation(() =>
      Promise.resolve({ id: 1 }),
    );

    await expect(
      service.create({ name: 'Solventes', type: RiskTypeEnum.QUI }, 1),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('4. permite mesmo slug em tipos diferentes', async () => {
    repository.findByTypeAndSlug.mockImplementation(() => Promise.resolve(null));
    repository.create.mockImplementation(() => Promise.resolve({ id: 11 }));

    await service.create({ name: 'Solventes', type: RiskTypeEnum.FIS }, 1);

    expect(repository.findByTypeAndSlug).toHaveBeenCalledWith(
      RiskFactorsEnum.FIS,
      'solventes',
    );
    expect(repository.create).toHaveBeenCalled();
  });

  it('bloqueia alteração de nome em subtipo system=true', async () => {
    repository.findById.mockImplementation(() =>
      Promise.resolve({
        id: 1,
        name: 'Psicossociais',
        slug: 'psicossociais',
        type: RiskFactorsEnum.ERG,
        system: true,
        status: StatusEnum.ACTIVE,
      }),
    );

    await expect(service.update(1, { name: 'Outro nome' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('11. browse repassa paginação e filtros', async () => {
    repository.browse.mockImplementation(() =>
      Promise.resolve({
        results: [],
        pagination: { page: 2, limit: 10, total: 0 },
      }),
    );

    const result = await service.browse({
      page: 2,
      limit: 10,
      filters: {
        type: RiskTypeEnum.QUI,
        search: 'sol',
        status: StatusEnum.ACTIVE,
      },
    });

    expect(repository.browse).toHaveBeenCalledWith({
      page: 2,
      limit: 10,
      filters: {
        type: RiskTypeEnum.QUI,
        search: 'sol',
        status: StatusEnum.ACTIVE,
      },
    });
    expect(result.pagination.page).toBe(2);
  });

  it('updateStatus retorna 404 quando subtipo não existe', async () => {
    repository.findById.mockImplementation(() => Promise.resolve(null));

    await expect(
      service.updateStatus(999, StatusEnum.INACTIVE),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
