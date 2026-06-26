import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { BadRequestException } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { BulkUpdateExamRiskDto } from '../../../dto/exam-risk.dto';
import { BulkUpdateExamRiskService } from './bulk-update-exam-risk.service';

const flushAsync = () => new Promise((resolve) => setImmediate(resolve));

const COMPANY_ID = 'company-current';

describe('BulkUpdateExamRiskService', () => {
  let service: BulkUpdateExamRiskService;
  let examRiskRepository: {
    findNude: jest.Mock;
    updateManyFields: jest.Mock;
  };
  let checkEmployeeExamService: { execute: jest.Mock };

  const user = { targetCompanyId: COMPANY_ID } as UserPayloadDto;

  beforeEach(() => {
    examRiskRepository = {
      findNude: jest.fn(),
      updateManyFields: jest.fn(),
    };
    checkEmployeeExamService = {
      execute: jest.fn(() => Promise.resolve()),
    };

    service = new BulkUpdateExamRiskService(
      examRiskRepository as any,
      checkEmployeeExamService as any,
    );
  });

  const mockAffected = (
    rows: { id: number; riskId: string }[] = [
      { id: 1, riskId: 'risk-a' },
      { id: 2, riskId: 'risk-b' },
    ],
  ) => {
    examRiskRepository.findNude.mockResolvedValue(rows as never);
    examRiskRepository.updateManyFields.mockResolvedValue(rows.length as never);
  };

  it('aplica boolean false corretamente (não ignora false)', async () => {
    mockAffected();
    const dto: BulkUpdateExamRiskDto = {
      ids: [1, 2],
      patch: { isMale: false },
    };

    await service.execute(dto, user);

    const dataArg = examRiskRepository.updateManyFields.mock.calls[0][2];
    expect(dataArg).toHaveProperty('isMale', false);
  });

  it('aplica null para limpar campos numéricos (não vira 0)', async () => {
    mockAffected();
    const dto: BulkUpdateExamRiskDto = {
      ids: [1, 2],
      patch: { fromAge: null, toAge: null, considerBetweenDays: null },
    };

    await service.execute(dto, user);

    const dataArg = examRiskRepository.updateManyFields.mock.calls[0][2];
    expect(dataArg).toHaveProperty('fromAge', null);
    expect(dataArg).toHaveProperty('toAge', null);
    expect(dataArg).toHaveProperty('considerBetweenDays', null);
  });

  it('não envia campos omitidos no patch', async () => {
    mockAffected();
    const dto: BulkUpdateExamRiskDto = {
      ids: [1, 2],
      patch: { isMale: true },
    };

    await service.execute(dto, user);

    const dataArg = examRiskRepository.updateManyFields.mock.calls[0][2];
    expect(Object.keys(dataArg)).toEqual(['isMale']);
    expect(dataArg).not.toHaveProperty('isFemale');
    expect(dataArg).not.toHaveProperty('validityInMonths');
  });

  it('restringe a busca por companyId + deletedAt:null e atualiza apenas ids encontrados', async () => {
    mockAffected([{ id: 1, riskId: 'risk-a' }]);
    const dto: BulkUpdateExamRiskDto = {
      ids: [1, 2, 3],
      patch: { validityInMonths: 12 },
    };

    await service.execute(dto, user);

    expect(examRiskRepository.findNude).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: { in: [1, 2, 3] }, companyId: COMPANY_ID, deletedAt: null },
      }),
    );
    // updateManyFields recebe apenas os ids efetivamente encontrados (1)
    expect(examRiskRepository.updateManyFields).toHaveBeenCalledWith(
      [1],
      COMPANY_ID,
      expect.objectContaining({ validityInMonths: 12 }),
    );
  });

  it('dispara CheckEmployeeExamService para todos os riscos afetados (não só um)', async () => {
    mockAffected([
      { id: 1, riskId: 'risk-a' },
      { id: 2, riskId: 'risk-b' },
      { id: 3, riskId: 'risk-a' },
    ]);
    const dto: BulkUpdateExamRiskDto = { ids: [1, 2, 3], patch: { isMale: true } };

    await service.execute(dto, user);
    await flushAsync();

    const calledRiskIds = checkEmployeeExamService.execute.mock.calls.map(
      (call: any[]) => call[0].riskId,
    );
    expect(calledRiskIds).toEqual(
      expect.arrayContaining(['risk-a', 'risk-b']),
    );
    // riscos únicos: risk-a e risk-b → 2 chamadas
    expect(checkEmployeeExamService.execute).toHaveBeenCalledTimes(2);
  });

  it('rejeita patch vazio', async () => {
    await expect(
      service.execute({ ids: [1], patch: {} }, user),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(examRiskRepository.findNude).not.toHaveBeenCalled();
  });

  it('rejeita lista de ids vazia', async () => {
    await expect(
      service.execute({ ids: [], patch: { isMale: true } }, user),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejeita quando nenhum vínculo é encontrado para a empresa', async () => {
    examRiskRepository.findNude.mockResolvedValue([] as never);
    await expect(
      service.execute({ ids: [99], patch: { isMale: true } }, user),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(examRiskRepository.updateManyFields).not.toHaveBeenCalled();
  });
});
