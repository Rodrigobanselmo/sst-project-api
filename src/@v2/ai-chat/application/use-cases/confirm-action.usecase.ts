import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { AiPendingActionRepository } from '../../database/repositories/ai-pending-action.repository';
import { AiPendingActionServiceEnum, AiPendingActionStatusEnum } from '@prisma/client';
import { UpsertRiskDataService } from '../../../../modules/sst/services/risk-data/upsert-risk-data/upsert-risk.service';
import { UpsertManyRiskDataService } from '../../../../modules/sst/services/risk-data/upsert-many-risk-data/upsert-many-risk-data.service';

@Injectable()
export class ConfirmActionUseCase {
  constructor(
    private readonly aiPendingActionRepository: AiPendingActionRepository,
    private readonly upsertRiskDataService: UpsertRiskDataService,
    private readonly upsertManyRiskDataService: UpsertManyRiskDataService,
  ) {}

  async execute(user: UserPayloadDto, actionId: string) {
    // 1. Buscar ação pendente
    const action = await this.aiPendingActionRepository.findById(actionId);

    if (!action) {
      throw new NotFoundException('Ação não encontrada');
    }

    // 2. Validar ownership
    if (action.userId !== user.userId) {
      throw new ForbiddenException('Você não tem permissão para executar esta ação');
    }

    // 3. Validar status
    if (action.status !== AiPendingActionStatusEnum.PENDING) {
      throw new BadRequestException(`Ação já foi ${action.status.toLowerCase()}`);
    }

    // 4. Marcar como executando
    await this.aiPendingActionRepository.updateStatus(actionId, AiPendingActionStatusEnum.EXECUTING);

    try {
      // 5. Executar lógica baseada no serviço
      let result: any;

      switch (action.service) {
        case AiPendingActionServiceEnum.UPSERT_RISK_DATA:
          result = await this.upsertRiskDataService.execute(action.payload as any);
          break;

        case AiPendingActionServiceEnum.UPSERT_MANY_RISK_DATA:
          result = await this.upsertManyRiskDataService.execute(action.payload as any);
          break;

        default:
          throw new BadRequestException(`Serviço desconhecido: ${action.service}`);
      }

      // 6. Marcar como completada
      await this.aiPendingActionRepository.updateStatus(actionId, AiPendingActionStatusEnum.COMPLETED);

      return {
        success: true,
        actionId,
        status: 'COMPLETED',
        result,
      };
    } catch (error) {
      // 7. Marcar como falha com mensagem de erro
      const errorMessage = error instanceof Error ? error.message : String(error);
      await this.aiPendingActionRepository.updateStatus(actionId, AiPendingActionStatusEnum.FAILED, errorMessage);

      throw new BadRequestException(`Falha ao executar ação: ${errorMessage}`);
    }
  }

  async cancel(user: UserPayloadDto, actionId: string) {
    // 1. Buscar ação pendente
    const action = await this.aiPendingActionRepository.findById(actionId);

    if (!action) {
      throw new NotFoundException('Ação não encontrada');
    }

    // 2. Validar ownership
    if (action.userId !== user.userId) {
      throw new ForbiddenException('Você não tem permissão para cancelar esta ação');
    }

    // 3. Validar status
    if (action.status !== AiPendingActionStatusEnum.PENDING) {
      throw new BadRequestException(`Ação já foi ${action.status.toLowerCase()}`);
    }

    // 4. Marcar como cancelada
    await this.aiPendingActionRepository.updateStatus(actionId, AiPendingActionStatusEnum.CANCELLED);

    return {
      success: true,
      actionId,
      status: 'CANCELLED',
    };
  }
}
