import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { ExamTypeEnum, StatusEnum } from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';
import { simpleCompanyId } from '@/shared/constants/ids';

import { ResolveSystemExamForRulePublicationService } from './resolve-system-exam-for-rule-publication.service';

const hemogramaName =
  'Hemograma com contagem de plaquetas ou frações (eritrograma, leucograma, plaquetas)';

const localExam = {
  id: 6,
  name: hemogramaName,
  companyId: '6527c27e-949a-4888-a784-ac4e4b19ed0c',
  system: false,
  status: StatusEnum.ACTIVE,
  type: ExamTypeEnum.LAB,
  material: null,
  analyses: null,
  instruction: null,
  esocial27Code: '0693',
  isAttendance: false,
  isAvaliation: false,
  obsProc: null,
};

const globalExam = {
  ...localExam,
  id: 70,
  companyId: simpleCompanyId,
  system: true,
};

describe('ResolveSystemExamForRulePublicationService', () => {
  let service: ResolveSystemExamForRulePublicationService;
  let prisma: {
    exam: {
      findFirst: jest.Mock<any>;
      findMany: jest.Mock<any>;
      create: jest.Mock<any>;
    };
  };

  beforeEach(() => {
    prisma = {
      exam: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
      },
    };
    service = new ResolveSystemExamForRulePublicationService(
      prisma as unknown as PrismaService,
    );
  });

  it('exame já system/global → action same', async () => {
    prisma.exam.findFirst.mockResolvedValue(globalExam);

    const result = await service.resolve(70);

    expect(result).toMatchObject({
      systemExamId: 70,
      action: 'same',
    });
    expect(prisma.exam.create).not.toHaveBeenCalled();
  });

  it('exame local com mesmo esocial27Code de global → reusedGlobal (6 → 70)', async () => {
    prisma.exam.findFirst
      .mockResolvedValueOnce(localExam)
      .mockResolvedValueOnce(globalExam);

    const result = await service.resolve(6);

    expect(result).toMatchObject({
      systemExamId: 70,
      action: 'reusedGlobal',
      esocial27Code: '0693',
    });
    expect(prisma.exam.create).not.toHaveBeenCalled();
  });

  it('exame local sem equivalente → createdGlobal', async () => {
    const localWithoutCode = {
      ...localExam,
      id: 12,
      esocial27Code: null,
      name: 'Exame exclusivo da empresa',
    };
    prisma.exam.findFirst.mockResolvedValueOnce(localWithoutCode);
    prisma.exam.findMany.mockResolvedValue([]);
    prisma.exam.create.mockResolvedValue({
      ...localWithoutCode,
      id: 501,
      companyId: simpleCompanyId,
      system: true,
    });

    const result = await service.resolve(12);

    expect(result).toMatchObject({
      systemExamId: 501,
      action: 'createdGlobal',
    });
    expect(prisma.exam.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          system: true,
          companyId: simpleCompanyId,
          status: StatusEnum.ACTIVE,
          name: 'Exame exclusivo da empresa',
        }),
      }),
    );
  });

  it('repetição com equivalente existente não cria novo global', async () => {
    prisma.exam.findFirst
      .mockResolvedValueOnce(localExam)
      .mockResolvedValueOnce(globalExam);

    await service.resolve(6);
    prisma.exam.findFirst.mockReset();
    prisma.exam.findFirst
      .mockResolvedValueOnce(localExam)
      .mockResolvedValueOnce(globalExam);

    const second = await service.resolve(6);

    expect(second?.action).toBe('reusedGlobal');
    expect(prisma.exam.create).not.toHaveBeenCalled();
  });

  it('retorna null quando exame não existe', async () => {
    prisma.exam.findFirst.mockResolvedValue(null);

    await expect(service.resolve(999)).resolves.toBeNull();
  });
});
