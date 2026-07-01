import { Injectable, NotFoundException } from '@nestjs/common';

import { RiskSubtypeCurationRepository } from './risk-subtype-curation.repository';
import { RiskSubTypeAiInstructionRepository } from './risk-subtype-ai-instruction.repository';
import type { RiskSubTypeAiInstructionRecord } from './risk-subtype-ai-instruction.types';
import { RiskSubtypeCurationAiPromptService } from './risk-subtype-curation-ai-prompt.service';
import type { UpsertRiskSubTypeAiInstructionBody } from './risk-subtype-curation-ai-instruction.dto';

@Injectable()
export class RiskSubTypeAiInstructionService {
  constructor(
    private readonly curationRepository: RiskSubtypeCurationRepository,
    private readonly instructionRepository: RiskSubTypeAiInstructionRepository,
    private readonly promptService: RiskSubtypeCurationAiPromptService,
  ) {}

  async getInstruction(subTypeId: number): Promise<RiskSubTypeAiInstructionRecord> {
    await this.assertSubTypeExists(subTypeId);

    return (
      (await this.instructionRepository.findBySubTypeId(subTypeId)) ??
      this.promptService.createDefaultInstruction(subTypeId)
    );
  }

  async upsertInstruction(
    subTypeId: number,
    body: UpsertRiskSubTypeAiInstructionBody,
    updatedById: number,
  ): Promise<RiskSubTypeAiInstructionRecord> {
    await this.assertSubTypeExists(subTypeId);

    return this.instructionRepository.upsert({
      subTypeId,
      useSystemDefault: body.useSystemDefault,
      instructions: body.instructions ?? null,
      positiveExamples: body.positiveExamples ?? null,
      negativeExamples: body.negativeExamples ?? null,
      cautionRules: body.cautionRules ?? null,
      preferredModel: body.preferredModel ?? null,
      updatedById,
    });
  }

  private async assertSubTypeExists(subTypeId: number): Promise<void> {
    const subType = await this.curationRepository.findSubTypeById(subTypeId);
    if (!subType) {
      throw new NotFoundException('Subtipo de risco não encontrado.');
    }
  }
}
