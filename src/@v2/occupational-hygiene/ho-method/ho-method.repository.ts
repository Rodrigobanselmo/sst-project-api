import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';

import { mapHoMethodRecord } from './ho-method.mapper';
import {
  HoMethodWriteInput,
  hoMethodInclude,
  hoMethodLegacyInclude,
} from './ho-method.types';

@Injectable()
export class HoMethodRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async create(input: HoMethodWriteInput) {
    const record = await this.prisma.$transaction(async (tx) => {
      const method = await tx.hoMethod.create({
        data: this.toMethodData(input),
      });

      await this.syncAgents(tx, method.id, input);
      await this.syncLaboratories(tx, method.id, input);

      return this.findFirstOrThrowWithFallback(tx, method.id);
    });

    return mapHoMethodRecord(record);
  }

  async update(id: string, input: HoMethodWriteInput) {
    const record = await this.prisma.$transaction(async (tx) => {
      await tx.hoMethodEvaluationCondition.deleteMany({ where: { hoMethodId: id } });

      if (this.hasHoMethodAgentModel(tx)) {
        await tx.hoMethodAgent.deleteMany({ where: { hoMethodId: id } });
      }

      await tx.hoMethodLaboratory.deleteMany({ where: { hoMethodId: id } });

      await tx.hoMethod.update({
        where: { id },
        data: this.toMethodData(input),
      });

      await this.syncAgents(tx, id, input);
      await this.syncLaboratories(tx, id, input);

      return this.findFirstOrThrowWithFallback(tx, id);
    });

    return mapHoMethodRecord(record);
  }

  async softDelete(id: string) {
    try {
      const record = await this.prisma.hoMethod.update({
        where: { id },
        data: {
          deleted_at: new Date(),
          status: 'INACTIVE',
        },
        include: hoMethodInclude,
      });

      return mapHoMethodRecord(record);
    } catch (error) {
      if (!this.shouldFallbackToLegacyInclude(error)) throw error;

      const record = await this.prisma.hoMethod.update({
        where: { id },
        data: {
          deleted_at: new Date(),
          status: 'INACTIVE',
        },
        include: hoMethodLegacyInclude,
      });

      return mapHoMethodRecord(record);
    }
  }

  private async findFirstOrThrowWithFallback(
    tx: Prisma.TransactionClient,
    id: string,
  ) {
    try {
      return await tx.hoMethod.findFirstOrThrow({
        where: { id },
        include: hoMethodInclude,
      });
    } catch (error) {
      if (!this.shouldFallbackToLegacyInclude(error)) throw error;

      return tx.hoMethod.findFirstOrThrow({
        where: { id },
        include: hoMethodLegacyInclude,
      });
    }
  }

  private hasHoMethodAgentModel(tx: Prisma.TransactionClient) {
    return Boolean((tx as { hoMethodAgent?: { create?: unknown } }).hoMethodAgent?.create);
  }

  private shouldFallbackToLegacyInclude(error: unknown) {
    if (!(error instanceof Prisma.PrismaClientValidationError)) return false;

    const message = error.message ?? '';
    return (
      message.includes('Unknown field `agents`') ||
      message.includes('Invalid scalar field `sampler`') ||
      message.includes('Unknown model `HoMethodAgent`')
    );
  }

  private toMethodData(input: HoMethodWriteInput) {
    return {
      displayName: input.displayName,
      description: input.description ?? null,
      agentName: input.agentName ?? null,
      cas: input.cas ?? null,
      riskFactorId: input.riskFactorId ?? null,
      institution: input.institution,
      methodCode: input.methodCode,
      methodVersion: input.methodVersion ?? null,
      analyticalMethod: input.analyticalMethod ?? null,
      agentType: input.agentType ?? 'CHEMICAL',
      prioritized: input.prioritized ?? false,
      status: input.status ?? 'ACTIVE',
      samplerId: input.samplerId ?? null,
      minimumFlowRate: input.minimumFlowRate ?? null,
      maximumFlowRate: input.maximumFlowRate ?? null,
      minimumVolume: input.minimumVolume ?? null,
      maximumVolume: input.maximumVolume ?? null,
      flowRateUnit: input.flowRateUnit ?? null,
      volumeUnit: input.volumeUnit ?? null,
      storageTemperature: input.storageTemperature ?? null,
      storageTemperatureUnit: input.storageTemperatureUnit?.trim() || '°C',
      stabilityDays: input.stabilityDays ?? null,
      extractionSolventId: input.extractionSolventId ?? null,
      originalDocumentFileId: input.originalDocumentFileId ?? null,
      originalDocumentName: input.originalDocumentName ?? null,
      originalDocumentUploadedAt: input.originalDocumentUploadedAt ?? null,
      notes: input.notes ?? null,
    };
  }

  private async syncAgents(
    tx: Prisma.TransactionClient,
    hoMethodId: string,
    input: HoMethodWriteInput,
  ) {
    const agents = input.agents ?? [];

    if (this.hasHoMethodAgentModel(tx)) {
      for (const [index, agent] of agents.entries()) {
        const createdAgent = await tx.hoMethodAgent.create({
          data: {
            hoMethodId,
            riskFactorId: agent.riskFactorId,
            agentNameSnapshot: agent.agentName?.trim() || null,
            casSnapshot: agent.cas?.trim() || null,
            unitSnapshot: agent.unit?.trim() || null,
            agentType: agent.agentType ?? null,
            sortOrder: index,
          },
        });

        if (agent.evaluationConditions?.length) {
          await tx.hoMethodEvaluationCondition.createMany({
            data: agent.evaluationConditions.map((condition) => ({
              hoMethodId,
              hoMethodAgentId: createdAgent.id,
              evaluationType: condition.evaluationType,
              limitValue: condition.limitValue ?? null,
              limitUnit: condition.limitUnit ?? null,
              minimumFlowRate: condition.minimumFlowRate ?? null,
              maximumFlowRate: condition.maximumFlowRate ?? null,
              minimumVolume: condition.minimumVolume ?? null,
              maximumVolume: condition.maximumVolume ?? null,
              flowRateUnit: condition.flowRateUnit ?? null,
              volumeUnit: condition.volumeUnit ?? null,
              notes: condition.notes ?? null,
            })),
          });
        }
      }
    }

    const legacyConditions = this.hasHoMethodAgentModel(tx)
      ? []
      : agents.length
        ? agents.flatMap((agent) => agent.evaluationConditions ?? [])
        : (input.evaluationConditions ?? []);

    if (legacyConditions.length) {
      await tx.hoMethodEvaluationCondition.createMany({
        data: legacyConditions.map((condition) => ({
          hoMethodId,
          evaluationType: condition.evaluationType,
          limitValue: condition.limitValue ?? null,
          limitUnit: condition.limitUnit ?? null,
          minimumFlowRate: condition.minimumFlowRate ?? null,
          maximumFlowRate: condition.maximumFlowRate ?? null,
          minimumVolume: condition.minimumVolume ?? null,
          maximumVolume: condition.maximumVolume ?? null,
          flowRateUnit: condition.flowRateUnit ?? null,
          volumeUnit: condition.volumeUnit ?? null,
          notes: condition.notes ?? null,
        })),
      });
    }
  }

  private async syncLaboratories(
    tx: Prisma.TransactionClient,
    hoMethodId: string,
    input: HoMethodWriteInput,
  ) {
    if (!input.laboratories?.length) return;

    await tx.hoMethodLaboratory.createMany({
      data: input.laboratories.map((lab) => ({
        hoMethodId,
        laboratoryId: lab.laboratoryId ?? null,
        laboratoryName: lab.laboratoryName?.trim() || 'Laboratório',
        availabilityStatus: lab.availabilityStatus ?? 'UNKNOWN',
        lastConfirmationDate: lab.lastConfirmationDate ?? null,
        notes: lab.notes ?? null,
        analyticalNotes: lab.analyticalNotes ?? null,
        samplerId: lab.samplerId ?? null,
        extractionSolventId: lab.extractionSolventId ?? null,
        minimumFlowRateOverride: lab.minimumFlowRateOverride ?? null,
        maximumFlowRateOverride: lab.maximumFlowRateOverride ?? null,
        minimumVolumeOverride: lab.minimumVolumeOverride ?? null,
        maximumVolumeOverride: lab.maximumVolumeOverride ?? null,
        storageTemperatureOverride: lab.storageTemperatureOverride ?? null,
        storageTemperatureUnitOverride:
          lab.storageTemperatureUnitOverride?.trim() || null,
        stabilityDaysOverride: lab.stabilityDaysOverride ?? null,
      })),
    });
  }
}
