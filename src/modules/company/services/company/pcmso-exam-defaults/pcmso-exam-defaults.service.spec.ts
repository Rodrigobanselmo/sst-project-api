import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { BadRequestException } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { PcmsoExamDefaultsService } from './pcmso-exam-defaults.service';

const COMPANY_ID = 'company-current';

describe('PcmsoExamDefaultsService', () => {
  let service: PcmsoExamDefaultsService;
  let prisma: {
    company: {
      findUnique: jest.Mock;
      update: jest.Mock;
    };
  };

  const user = { targetCompanyId: COMPANY_ID } as UserPayloadDto;

  beforeEach(() => {
    prisma = {
      company: {
        findUnique: jest.fn(),
        update: jest.fn(() => Promise.resolve({})),
      },
    };

    service = new PcmsoExamDefaultsService(prisma as any);
  });

  describe('get', () => {
    it('retorna objeto vazio quando a empresa não tem metadata', async () => {
      prisma.company.findUnique.mockResolvedValue({ metadata: null } as never);

      const result = await service.get(user);

      expect(result).toEqual({});
    });

    it('retorna apenas os defaults armazenados, ignorando outras chaves do metadata', async () => {
      prisma.company.findUnique.mockResolvedValue({
        metadata: {
          someOtherKey: 'keep-me',
          pcmsoExamDefaults: {
            isMale: true,
            validityInMonths: 12,
            unknownField: 'drop-me',
          },
        },
      } as never);

      const result = await service.get(user);

      expect(result).toEqual({ isMale: true, validityInMonths: 12 });
      expect((result as any).unknownField).toBeUndefined();
    });

    it('lança erro quando não há empresa no contexto', async () => {
      await expect(
        service.get({ targetCompanyId: undefined } as UserPayloadDto),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('update', () => {
    it('faz merge em metadata preservando outras chaves', async () => {
      prisma.company.findUnique.mockResolvedValue({
        metadata: { someOtherKey: 'keep-me' },
      } as never);

      await service.update({ isMale: true, isFemale: false }, user);

      expect(prisma.company.update).toHaveBeenCalledTimes(1);
      const args = prisma.company.update.mock.calls[0][0] as any;
      expect(args.where).toEqual({ id: COMPANY_ID });
      expect(args.data.metadata).toEqual({
        someOtherKey: 'keep-me',
        pcmsoExamDefaults: { isMale: true, isFemale: false },
      });
    });

    it('persiste null para limpar campos numéricos', async () => {
      prisma.company.findUnique.mockResolvedValue({ metadata: {} } as never);

      await service.update(
        { validityInMonths: null, considerBetweenDays: null },
        user,
      );

      const args = prisma.company.update.mock.calls[0][0] as any;
      expect(args.data.metadata.pcmsoExamDefaults).toEqual({
        validityInMonths: null,
        considerBetweenDays: null,
      });
    });

    it('mantém boolean false (não descarta)', async () => {
      prisma.company.findUnique.mockResolvedValue({ metadata: {} } as never);

      await service.update({ isPeriodic: false }, user);

      const args = prisma.company.update.mock.calls[0][0] as any;
      expect(args.data.metadata.pcmsoExamDefaults).toEqual({
        isPeriodic: false,
      });
    });

    it('descarta campos desconhecidos do payload', async () => {
      prisma.company.findUnique.mockResolvedValue({ metadata: {} } as never);

      await service.update({ isMale: true, hack: 'x' } as any, user);

      const args = prisma.company.update.mock.calls[0][0] as any;
      expect(args.data.metadata.pcmsoExamDefaults).toEqual({ isMale: true });
    });

    it('lança erro quando a empresa não existe', async () => {
      prisma.company.findUnique.mockResolvedValue(null as never);

      await expect(service.update({ isMale: true }, user)).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(prisma.company.update).not.toHaveBeenCalled();
    });
  });
});
