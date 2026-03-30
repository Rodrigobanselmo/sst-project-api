import { Injectable } from '@nestjs/common';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { AiPendingActionServiceEnum, AiPendingActionStatusEnum } from '@prisma/client';

// ─── Interfaces ──────────────────────────────────────────────

export interface CreatePendingActionDto {
  userId: number;
  companyId: string;
  messageId: string;
  service: AiPendingActionServiceEnum;
  payload: any;
  summary?: string;
}

export interface AIPendingAction {
  id: string;
  userId: number;
  companyId: string;
  messageId: string;
  service: AiPendingActionServiceEnum;
  payload: any;
  status: AiPendingActionStatusEnum;
  summary: string | null;
  executedAt: Date | null;
  errorMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Repository ──────────────────────────────────────────────

@Injectable()
export class AiPendingActionRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async create(data: CreatePendingActionDto): Promise<AIPendingAction> {
    const action = await this.prisma.aiPendingAction.create({
      data: {
        userId: data.userId,
        companyId: data.companyId,
        messageId: data.messageId,
        service: data.service,
        payload: data.payload,
        summary: data.summary,
        status: AiPendingActionStatusEnum.PENDING,
      },
    });

    return this.mapAction(action);
  }

  async findById(id: string): Promise<AIPendingAction | null> {
    const action = await this.prisma.aiPendingAction.findUnique({
      where: { id },
    });

    return action ? this.mapAction(action) : null;
  }

  async updateStatus(id: string, status: AiPendingActionStatusEnum, errorMessage?: string): Promise<AIPendingAction> {
    const action = await this.prisma.aiPendingAction.update({
      where: { id },
      data: {
        status,
        errorMessage,
        executedAt: status === AiPendingActionStatusEnum.COMPLETED ? new Date() : undefined,
      },
    });

    return this.mapAction(action);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.aiPendingAction.delete({
      where: { id },
    });
  }

  /**
   * Buscar ações por thread (para mostrar no histórico do chat)
   * Usa join com message para acessar threadId
   */
  async findByThread(threadId: string): Promise<AIPendingAction[]> {
    const actions = await this.prisma.aiPendingAction.findMany({
      where: {
        message: {
          threadId,
        },
      },
      orderBy: { created_at: 'asc' },
    });

    return actions.map((a: any) => this.mapAction(a));
  }

  /**
   * Buscar ação por messageId (útil para integração com histórico)
   */
  async findByMessage(messageId: string): Promise<AIPendingAction | null> {
    const action = await this.prisma.aiPendingAction.findFirst({
      where: { messageId },
      orderBy: { created_at: 'desc' },
    });

    return action ? this.mapAction(action) : null;
  }

  /**
   * Limpar ações antigas (> 30 dias e completadas/canceladas)
   */
  async cleanOldActions(): Promise<number> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const deletedResult = await this.prisma.aiPendingAction.deleteMany({
      where: {
        created_at: { lt: thirtyDaysAgo },
        status: { in: [AiPendingActionStatusEnum.COMPLETED, AiPendingActionStatusEnum.CANCELLED] },
      },
    });

    return deletedResult.count;
  }

  /**
   * Buscar ações pendentes de um usuário (para debugging/admin)
   */
  async findByUser(userId: number, limit = 10): Promise<AIPendingAction[]> {
    const actions = await this.prisma.aiPendingAction.findMany({
      where: { userId },
      orderBy: { created_at: 'desc' },
      take: limit,
    });

    return actions.map((a) => this.mapAction(a));
  }

  // ─── Mappers ─────────────────────────────────────────────

  private mapAction(raw: any): AIPendingAction {
    return {
      id: raw.id,
      userId: raw.userId,
      companyId: raw.companyId,
      messageId: raw.messageId,
      service: raw.service,
      payload: raw.payload,
      status: raw.status,
      summary: raw.summary,
      executedAt: raw.executedAt,
      errorMessage: raw.errorMessage,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
    };
  }
}
