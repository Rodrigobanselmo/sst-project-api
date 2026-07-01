import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { NotFoundException } from '@nestjs/common';

import { RiskSubTypeAiInstructionService } from './risk-subtype-ai-instruction.service';

describe('RiskSubTypeAiInstructionService', () => {
  let service: RiskSubTypeAiInstructionService;
  let curationRepository: { findSubTypeById: ReturnType<typeof jest.fn> };
  let instructionRepository: {
    findBySubTypeId: ReturnType<typeof jest.fn>;
    upsert: ReturnType<typeof jest.fn>;
  };
  let promptService: { createDefaultInstruction: ReturnType<typeof jest.fn> };

  beforeEach(() => {
    curationRepository = { findSubTypeById: jest.fn() };
    instructionRepository = {
      findBySubTypeId: jest.fn(),
      upsert: jest.fn(),
    };
    promptService = {
      createDefaultInstruction: jest.fn(),
    };

    promptService.createDefaultInstruction.mockImplementation((subTypeId: number) => ({
      subTypeId,
      useSystemDefault: true,
      instructions: null,
      positiveExamples: null,
      negativeExamples: null,
      cautionRules: null,
      preferredModel: null,
      revision: 0,
      updatedById: null,
      updatedAt: null,
    }));

    service = new RiskSubTypeAiInstructionService(
      curationRepository as never,
      instructionRepository as never,
      promptService as never,
    );
  });

  it('retorna default lógico quando não há instrução persistida', async () => {
    curationRepository.findSubTypeById.mockImplementation(() =>
      Promise.resolve({ id: 10, name: 'FEN/HA' }),
    );
    instructionRepository.findBySubTypeId.mockImplementation(() => Promise.resolve(null));

    const result = await service.getInstruction(10);

    expect(result.subTypeId).toBe(10);
    expect(result.useSystemDefault).toBe(true);
    expect(result.revision).toBe(0);
  });

  it('salva instrução do subtipo', async () => {
    curationRepository.findSubTypeById.mockImplementation(() =>
      Promise.resolve({ id: 10, name: 'FEN/HA' }),
    );
    instructionRepository.upsert.mockImplementation(() =>
      Promise.resolve({
        subTypeId: 10,
        useSystemDefault: false,
        instructions: 'Critério customizado',
        positiveExamples: 'Fenol',
        negativeExamples: 'Benzeno',
        cautionRules: 'Cautela',
        preferredModel: 'gpt-4o-mini',
        revision: 1,
        updatedById: 99,
        updatedAt: '2026-01-01T00:00:00.000Z',
      }),
    );

    const result = await service.upsertInstruction(
      10,
      {
        useSystemDefault: false,
        instructions: 'Critério customizado',
        positiveExamples: 'Fenol',
        negativeExamples: 'Benzeno',
        cautionRules: 'Cautela',
        preferredModel: 'gpt-4o-mini',
      },
      99,
    );

    expect(result.revision).toBe(1);
    expect(instructionRepository.upsert).toHaveBeenCalled();
  });

  it('rejeita subtipo inexistente', async () => {
    curationRepository.findSubTypeById.mockImplementation(() => Promise.resolve(null));

    await expect(service.getInstruction(999)).rejects.toBeInstanceOf(NotFoundException);
  });
});
