import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { BadRequestException } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { BulkDeleteExamRiskService } from './bulk-delete-exam-risk.service';

const flushAsync = () => new Promise((resolve) => setImmediate(resolve));

const COMPANY_ID = 'company-current';

describe('BulkDeleteExamRiskService', () => {
  let service: BulkDeleteExamRiskService;
  let examRiskRepository: {
    findNude: jest.Mock;
    deleteManySoft: jest.Mock;
  };
  let checkEmployeeExamService: { execute: jest.Mock };

  const user = { targetCompanyId: COMPANY_ID } as UserPayloadDto;

  beforeEach(() => {
    examRiskRepository = {
      findNude: jest.fn(),
      deleteManySoft: jest.fn(),
    };
    checkEmployeeExamService = {
      execute: jest.fn(() => Promise.resolve()),
    };

    service = new BulkDeleteExamRiskService(
      examRiskRepository as any,
      checkEmployeeExamService as any,
    );
  });

  it('faz soft delete em lote (usa deleteManySoft, restrito por empresa)', async () => {
    examRiskRepository.findNude.mockResolvedValue([
      { id: 1, riskId: 'risk-a' },
      { id: 2, riskId: 'risk-b' },
    ] as never);
    examRiskRepository.deleteManySoft.mockResolvedValue(2 as never);

    const result = await service.execute({ ids: [1, 2] }, user);

    // deleteManySoft = caminho de soft delete (seta deletedAt no repositório),
    // não há método de hard delete sendo chamado.
    expect(examRiskRepository.deleteManySoft).toHaveBeenCalledWith(
      [1, 2],
      COMPANY_ID,
    );
    expect(result).toEqual({ count: 2 });
  });

  it('restringe a busca por companyId + deletedAt:null', async () => {
    examRiskRepository.findNude.mockResolvedValue([
      { id: 1, riskId: 'risk-a' },
    ] as never);
    examRiskRepository.deleteManySoft.mockResolvedValue(1 as never);

    await service.execute({ ids: [1, 2, 3] }, user);

    expect(examRiskRepository.findNude).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: { in: [1, 2, 3] }, companyId: COMPANY_ID, deletedAt: null },
      }),
    );
    // só remove os ids realmente encontrados na empresa
    expect(examRiskRepository.deleteManySoft).toHaveBeenCalledWith(
      [1],
      COMPANY_ID,
    );
  });

  it('dispara CheckEmployeeExamService para todos os riscos afetados', async () => {
    examRiskRepository.findNude.mockResolvedValue([
      { id: 1, riskId: 'risk-a' },
      { id: 2, riskId: 'risk-b' },
      { id: 3, riskId: 'risk-a' },
    ] as never);
    examRiskRepository.deleteManySoft.mockResolvedValue(3 as never);

    await service.execute({ ids: [1, 2, 3] }, user);
    await flushAsync();

    const calledRiskIds = checkEmployeeExamService.execute.mock.calls.map(
      (call: any[]) => call[0].riskId,
    );
    expect(calledRiskIds).toEqual(expect.arrayContaining(['risk-a', 'risk-b']));
    expect(checkEmployeeExamService.execute).toHaveBeenCalledTimes(2);
  });

  it('rejeita lista de ids vazia', async () => {
    await expect(service.execute({ ids: [] }, user)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(examRiskRepository.findNude).not.toHaveBeenCalled();
  });

  it('rejeita quando nenhum vínculo é encontrado para a empresa', async () => {
    examRiskRepository.findNude.mockResolvedValue([] as never);
    await expect(service.execute({ ids: [99] }, user)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(examRiskRepository.deleteManySoft).not.toHaveBeenCalled();
  });
});
