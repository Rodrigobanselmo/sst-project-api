import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ExamTypeEnum, StatusEnum } from '@prisma/client';

import { ESocial27TableRepository } from '@/modules/esocial/repositories/implementations/ESocial27TableRepository';
import { PrismaService } from '@/prisma/prisma.service';
import { simpleCompanyId } from '@/shared/constants/ids';
import { RoleEnum } from '@/shared/constants/enum/authorization';
import { UserPayloadDto } from '@/shared/dto/user-payload.dto';

import { EsocialT27ExamService } from './esocial-t27-exam.service';

const catalog = [
  { code: '0005', name: '1,2-ciclo-hexanediol' },
  { code: '0100', name: 'Ácido etoxiacético' },
];

const masterUser = {
  userId: 1,
  companyId: simpleCompanyId,
  targetCompanyId: 'company-1',
  roles: [RoleEnum.MASTER],
} as UserPayloadDto;

const regularUser = {
  userId: 2,
  companyId: 'company-1',
  targetCompanyId: 'company-1',
  roles: [],
} as UserPayloadDto;

describe('EsocialT27ExamService', () => {
  let service: EsocialT27ExamService;
  let prisma: {
    exam: {
      findMany: jest.Mock<any>;
      findFirst: jest.Mock<any>;
      create: jest.Mock<any>;
    };
  };
  let esocialRepo: { findAll: jest.Mock<any> };

  beforeEach(() => {
    prisma = {
      exam: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
      },
    };
    esocialRepo = {
      findAll: jest.fn<() => Promise<typeof catalog>>().mockResolvedValue(catalog),
    };
    service = new EsocialT27ExamService(
      prisma as unknown as PrismaService,
      esocialRepo as unknown as ESocial27TableRepository,
    );
  });

  it('search returns empty when term is shorter than 3 chars', async () => {
    const result = await service.searchUnpublished({ search: 'ab' });
    expect(result.items).toEqual([]);
    expect(esocialRepo.findAll).not.toHaveBeenCalled();
  });

  it('search returns unpublished T27 procedures', async () => {
    prisma.exam.findMany.mockResolvedValue([{ esocial27Code: '0100' }]);

    const result = await service.searchUnpublished({ search: 'ciclo' });

    expect(result.items).toEqual([
      { code: '0005', name: '1,2-ciclo-hexanediol' },
    ]);
  });

  it('materialize rejects invalid code', async () => {
    await expect(
      service.materialize({ esocial27Code: '9999' }, masterUser),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('materialize reuses existing exam by esocial27Code', async () => {
    prisma.exam.findFirst.mockResolvedValue({
      id: 10,
      name: 'Ácido etoxiacético',
      esocial27Code: '0100',
      system: true,
      companyId: simpleCompanyId,
    });

    const result = await service.materialize(
      { esocial27Code: '0100', asSystem: true },
      masterUser,
    );

    expect(result).toMatchObject({
      examId: 10,
      created: false,
      scope: 'SYSTEM',
    });
    expect(prisma.exam.create).not.toHaveBeenCalled();
  });

  it('materialize creates global exam for MASTER', async () => {
    prisma.exam.findFirst.mockResolvedValue(null);
    prisma.exam.findMany.mockResolvedValue([]);
    prisma.exam.create.mockResolvedValue({
      id: 99,
      name: '1,2-ciclo-hexanediol',
      esocial27Code: '0005',
      system: true,
      companyId: simpleCompanyId,
    });

    const result = await service.materialize(
      { esocial27Code: '0005', asSystem: true },
      masterUser,
    );

    expect(prisma.exam.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          esocial27Code: '0005',
          system: true,
          companyId: simpleCompanyId,
          status: StatusEnum.ACTIVE,
          type: ExamTypeEnum.LAB,
        }),
      }),
    );
    expect(result).toMatchObject({
      examId: 99,
      created: true,
      scope: 'SYSTEM',
    });
  });

  it('materialize creates company exam for non-MASTER', async () => {
    prisma.exam.findFirst.mockResolvedValue(null);
    prisma.exam.findMany.mockResolvedValue([]);
    prisma.exam.create.mockResolvedValue({
      id: 100,
      name: '1,2-ciclo-hexanediol',
      esocial27Code: '0005',
      system: false,
      companyId: 'company-1',
    });

    const result = await service.materialize(
      { esocial27Code: '0005' },
      regularUser,
    );

    expect(prisma.exam.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          system: false,
          companyId: 'company-1',
        }),
      }),
    );
    expect(result.scope).toBe('COMPANY');
  });

  it('non-MASTER cannot create system exam', async () => {
    await expect(
      service.materialize({ esocial27Code: '0005', asSystem: true }, regularUser),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('materialize throws on ambiguous same-name exam without code', async () => {
    prisma.exam.findFirst.mockResolvedValue(null);
    prisma.exam.findMany.mockResolvedValue([
      { id: 88, name: '1,2-ciclo-hexanediol', esocial27Code: null },
    ]);

    await expect(
      service.materialize({ esocial27Code: '0005' }, regularUser),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
