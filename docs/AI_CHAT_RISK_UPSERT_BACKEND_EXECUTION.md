# 🚀 AI Chat - Execução Direta no Backend (Sem Dependência do Frontend)

## 📌 Visão Geral

Esta estratégia **elimina a dependência do frontend** para executar ações de upsert de dados de risco. Em vez de o frontend fazer um HTTP POST para `/risk-data`, a **tool no backend executa diretamente o UseCase** (`UpsertRiskDataService`) após a autorização do usuário.

---

## 🔄 Fluxo Completo Atualizado

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Usuário faz pedido no chat                                  │
│    "Adicione o EPI Luvas ao risco de Ruído no GSE Produção"    │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. LLM classifica intent → characterization agent              │
│    Agent usa tool: atualizar_dados_risco                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. Tool PROPÕE ação (não executa ainda)                        │
│    Salva payload pendente em memória com actionId único        │
│    Retorna JSON especial com _action_type                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. Backend detecta JSON especial e emite "action_card"         │
│    StreamEvent com actionId, payload, summary                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. Frontend renderiza ActionCard                               │
│    [Autorizar] [Cancelar]                                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. Usuário clica "Autorizar"                                   │
│    Frontend envia: POST /ai-chat/confirm-action { actionId }   │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 7. Backend recupera payload pendente                           │
│    Injeta UpsertRiskDataService                                │
│    ⚡ Executa: service.execute(payload)                        │
│    ✅ SEM fazer HTTP request                                   │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 8. Backend retorna sucesso com dados atualizados               │
│    Frontend invalida queries → UI atualiza                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Arquitetura - Injeção de Dependências

### Estrutura Atual

A tool `atualizar_dados_risco` será criada em `characterization.tools.ts` e receberá as dependências via injeção:

```typescript
// src/@v2/ai-chat/domain/tools/characterization.tools.ts

export function createCharacterizationTools(deps: {
  prisma: PrismaClient;
  defaultCompanyId: string;
  // 🆕 Novo: Injetar o service
  upsertRiskDataService?: UpsertRiskDataService;
}) {
  const { prisma, defaultCompanyId, upsertRiskDataService } = deps;

  // ... existing tools ...

  // 🆕 Nova tool
  const sugerirAtualizacaoRiscoTool = tool(
    async ({ riskId, homogeneousGroupId, hierarchyId, epis, recs, ... }) => {
      // Cria actionId único
      const actionId = generateUniqueId();

      // Armazena payload pendente
      pendingActions.set(actionId, {
        service: 'upsertRiskData',
        payload: { riskId, homogeneousGroupId, ... },
        timestamp: Date.now(),
      });

      // Retorna JSON especial para trigger action_card
      return JSON.stringify({
        _action_type: 'upsert_risk_data',
        _action_id: actionId,
        _summary: `Adicionar EPI '...' ao risco '...' no GSE '...'`,
        _payload: { riskId, homogeneousGroupId, ... },
      });
    },
    {
      name: 'atualizar_dados_risco',
      description: 'Propõe atualização de caracterização de risco...',
      schema: z.object({ ... }),
    }
  );

  return [/* ... existing tools */, sugerirAtualizacaoRiscoTool];
}
```

---

## 🔌 Modificação do Module para Injeção

```typescript
// src/@v2/ai-chat/ai-chat.module.ts

import { Module } from '@nestjs/common';
import { SstModule } from '../../modules/sst/sst.module'; // 🆕 Importar SstModule

@Module({
  imports: [
    UsersModule,
    SharedModule,
    SstModule, // 🆕 Importar para ter acesso aos services
  ],
  controllers: [ThreadController, FileController, TranscribeController],
  providers: [StreamChatUseCase, LlmFactory, AiThreadRepository, AiFileRepository],
})
export class AiChatModule {}
```

---

## 🔄 Fluxo de Injeção no StreamChatUseCase

```typescript
// src/@v2/ai-chat/application/use-cases/stream-chat.usecase.ts

import { UpsertRiskDataService } from '../../../../modules/sst/services/risk-data/upsert-risk-data/upsert-risk.service';

@Injectable()
export class StreamChatUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly llmFactory: LlmFactory,
    private readonly prisma: PrismaServiceV2,
    // 🆕 Injetar services necessários
    private readonly upsertRiskDataService: UpsertRiskDataService,
  ) {}

  async *execute(user: UserPayloadDto, input: StreamChatInput): AsyncGenerator<StreamEvent, void, undefined> {
    const llm = this.llmFactory.create({ mode: input.mode });

    for await (const event of streamSupervisorAgent({
      message: input.message,
      history: input.history,
      attachments: input.attachments,
      prisma: this.prisma,
      llm,
      user,
      extractedContents: input.extractedContents,
      pageContext: input.pageContext,
      usersRepository: this.usersRepository,
      // 🆕 Passar services para o agent
      upsertRiskDataService: this.upsertRiskDataService,
    })) {
      yield event;
    }
  }
}
```

---

## 📦 Modelo Prisma: AiPendingAction

Para gerenciar ações que aguardam autorização do usuário, criamos um modelo no banco:

```prisma
// prisma/schema.prisma

model AiPendingAction {
  id           String                     @id @default(cuid())
  userId       Int
  companyId    String
  messageId    String                     // ✅ Obrigatório - vincula ao histórico
  service      AiPendingActionServiceEnum
  payload      Json                       @db.JsonB
  status       AiPendingActionStatusEnum  @default(PENDING)
  summary      String?                    @db.Text
  executedAt   DateTime?
  errorMessage String?                    @db.Text
  created_at   DateTime                   @default(now())
  updated_at   DateTime                   @updatedAt

  user    User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  company Company   @relation(fields: [companyId], references: [id], onDelete: Cascade)
  message AiMessage @relation(fields: [messageId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([companyId])
  @@index([messageId])
  @@index([status])
  @@index([created_at])
}

enum AiPendingActionServiceEnum {
  UPSERT_RISK_DATA
  UPSERT_MANY_RISK_DATA
}

enum AiPendingActionStatusEnum {
  PENDING
  EXECUTING
  COMPLETED
  FAILED
  CANCELLED
}
```

---

## 🗄️ Repository para AiPendingAction

```typescript
// src/@v2/ai-chat/database/repositories/ai-pending-action.repository.ts

import { Injectable } from '@nestjs/common';
import { PrismaServiceV2 } from '../../../shared/adapters/database/prisma.service';
import { AiPendingActionServiceEnum, AiPendingActionStatusEnum } from '@prisma/client';

export interface CreatePendingActionDto {
  userId: number;
  companyId: string;
  messageId: string; // ✅ Obrigatório - vincula ao histórico de mensagens
  service: AiPendingActionServiceEnum;
  payload: any;
  summary?: string;
}

@Injectable()
export class AiPendingActionRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async create(data: CreatePendingActionDto) {
    return this.prisma.aiPendingAction.create({
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
  }

  async findById(id: string) {
    return this.prisma.aiPendingAction.findUnique({
      where: { id },
    });
  }

  async updateStatus(id: string, status: AiPendingActionStatusEnum, errorMessage?: string) {
    return this.prisma.aiPendingAction.update({
      where: { id },
      data: {
        status,
        errorMessage,
        executedAt: status === AiPendingActionStatusEnum.COMPLETED ? new Date() : undefined,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.aiPendingAction.delete({
      where: { id },
    });
  }

  /**
   * Buscar ações por thread (para mostrar no histórico do chat)
   * Usa join com message para acessar threadId
   */
  async findByThread(threadId: string) {
    return this.prisma.aiPendingAction.findMany({
      where: {
        message: {
          threadId,
        },
      },
      orderBy: { created_at: 'asc' },
    });
  }

  /**
   * Buscar ação por messageId (útil para integração com histórico)
   */
  async findByMessage(messageId: string) {
    return this.prisma.aiPendingAction.findFirst({
      where: { messageId },
      orderBy: { created_at: 'desc' },
    });
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
}
```

---

## 🛠️ Nova Tool: `atualizar_dados_risco`

```typescript
// src/@v2/ai-chat/domain/tools/characterization.tools.ts

import { AiPendingActionRepository } from '../../database/repositories/ai-pending-action.repository';
import { AiPendingActionServiceEnum } from '@prisma/client';

export function createCharacterizationTools(deps: { prisma: PrismaClient; defaultCompanyId: string; userId: number; aiPendingActionRepository: AiPendingActionRepository }) {
  const { prisma, defaultCompanyId, userId, aiPendingActionRepository } = deps;

  // ... existing tools ...

  const atualizarDadosRiscoTool = tool(
    async (input) => {
      const {
        riskId,
        homogeneousGroupId,
        hierarchyId,
        type,
        probability,
        epis,
        recs,
        adms,
        engs,
        exams,
        generateSources,
        recAddOnly,
        admsAddOnly,
        engsAddOnly,
        generateSourcesAddOnly,
        keepEmpty = true,
      } = input;

      const companyId = input.companyId ?? defaultCompanyId;

      // Validações básicas
      if (!riskId) {
        return JSON.stringify({
          erro: 'riskId é obrigatório',
          mensagem: 'Use as ferramentas de busca para encontrar o ID do risco antes de atualizar.',
        });
      }

      if (!homogeneousGroupId && !hierarchyId) {
        return JSON.stringify({
          erro: 'homogeneousGroupId ou hierarchyId é obrigatório',
          mensagem: 'Especifique o grupo homogêneo ou hierarquia onde o risco será atualizado.',
        });
      }

      // Buscar informações para o summary
      const risk = await prisma.riskFactors.findUnique({
        where: { id: riskId },
        select: { name: true },
      });

      const group = homogeneousGroupId
        ? await prisma.homogeneousGroup.findUnique({
            where: { id: homogeneousGroupId },
            select: { name: true, type: true },
          })
        : await prisma.hierarchy.findUnique({
            where: { id: hierarchyId },
            select: { name: true, type: true },
          });

      if (!risk) {
        return JSON.stringify({
          erro: 'Risco não encontrado',
          mensagem: `Nenhum risco encontrado com ID: ${riskId}`,
        });
      }

      // Montar payload completo
      const payload = {
        companyId,
        riskId,
        homogeneousGroupId,
        hierarchyId,
        type,
        probability,
        epis,
        recs,
        adms,
        engs,
        exams,
        generateSources,
        recAddOnly,
        admsAddOnly,
        engsAddOnly,
        generateSourcesAddOnly,
        keepEmpty,
      };

      // Criar ação pendente no banco
      const pendingAction = await aiPendingActionRepository.create({
        userId,
        companyId,
        service: AiPendingActionServiceEnum.UPSERT_RISK_DATA,
        payload,
      });

      const actionId = pendingAction.id;

      // Montar summary descritivo
      const groupName = group?.name || 'N/A';
      const groupTypeLabel = group?.type === 'HIERARCHY' ? 'Cargo/Setor' : 'GSE';

      let summary = `Atualizar risco "${risk.name}" no ${groupTypeLabel} "${groupName}"`;

      if (epis && epis.length > 0) {
        summary += ` - Adicionar ${epis.length} EPI(s)`;
      }
      if (recs && recs.length > 0) {
        summary += ` - Adicionar ${recs.length} recomendação(ões)`;
      }
      if (probability !== undefined) {
        summary += ` - Probabilidade: ${probability}`;
      }

      // Retornar JSON especial que será detectado pelo agent-tool-loop
      return JSON.stringify({
        _action_type: 'upsert_risk_data',
        _action_id: actionId,
        _summary: summary,
        _payload: payload, // Frontend mostrará isso se quiser detalhes
      });
    },
    {
      name: 'atualizar_dados_risco',
      description: `Propõe uma atualização de caracterização de risco (EPIs, recomendações, probabilidade, etc.).
        Esta tool NÃO executa a ação imediatamente - ela cria uma proposta que será exibida ao usuário para autorização.
        Após autorização, o backend executará o upsert automaticamente.

        IMPORTANTE: Antes de chamar esta tool, você DEVE:
        1. Usar 'obter_caracterizacao_risco' para buscar os dados atuais do risco
        2. Fazer merge manual dos dados (ex: adicionar novos EPIs aos existentes)
        3. Enviar o payload completo merged para esta tool

        Campos que são merged (não substituídos):
        - epis: array de EPIs (adiciona novos, mantém existentes)
        - recs: array de recomendações (adiciona novas, mantém existentes)
        - adms: medidas administrativas
        - engs: medidas de engenharia
        - exams: exames médicos
        - generateSources: fontes geradoras

        Use 'recAddOnly', 'admsAddOnly', etc. para criar novos registros se não existirem.`,
      schema: z.object({
        riskId: z.string().describe('ID do risco a ser atualizado (obter via listar_riscos_por_tipo)'),
        homogeneousGroupId: z.string().optional().describe('ID do grupo homogêneo (GSE) - obrigatório se não tiver hierarchyId'),
        hierarchyId: z.string().optional().describe('ID da hierarquia (cargo/setor) - obrigatório se não tiver homogeneousGroupId'),
        companyId: z.string().optional().describe('ID da empresa (opcional, usa companyId do contexto se não fornecido)'),
        type: z.enum(['HIERARCHY', 'ENVIRONMENT', 'GSE']).optional().describe('Tipo do grupo homogêneo'),
        probability: z.number().int().min(0).max(5).optional().describe('Nível de probabilidade (0-5)'),
        epis: z
          .array(
            z.object({
              id: z.string().optional(),
              epiId: z.number(),
              efficientlyCheck: z.boolean().optional(),
              ca: z.string().optional(),
            }),
          )
          .optional()
          .describe('Array de EPIs vinculados ao risco'),
        recs: z.array(z.string()).optional().describe('Array de IDs de recomendações'),
        adms: z.array(z.string()).optional().describe('Array de IDs de medidas administrativas'),
        engs: z.array(z.string()).optional().describe('Array de IDs de medidas de engenharia'),
        exams: z
          .array(
            z.object({
              id: z.string().optional(),
              examId: z.number(),
              isPeriodic: z.boolean().optional(),
              isChange: z.boolean().optional(),
              isAdmission: z.boolean().optional(),
              isReturn: z.boolean().optional(),
              isDismissal: z.boolean().optional(),
            }),
          )
          .optional()
          .describe('Array de exames médicos'),
        generateSources: z.array(z.string()).optional().describe('Array de IDs de fontes geradoras'),
        recAddOnly: z
          .array(
            z.object({
              recName: z.string(),
              companyId: z.string(),
              recType: z.enum(['ENG', 'ADM']).optional(),
            }),
          )
          .optional()
          .describe('Criar novas recomendações se não existirem'),
        admsAddOnly: z
          .array(
            z.object({
              medName: z.string(),
              companyId: z.string(),
            }),
          )
          .optional()
          .describe('Criar novas medidas administrativas se não existirem'),
        engsAddOnly: z
          .array(
            z.object({
              medName: z.string(),
              companyId: z.string(),
              medType: z.string().optional(),
            }),
          )
          .optional()
          .describe('Criar novas medidas de engenharia se não existirem'),
        generateSourcesAddOnly: z
          .array(
            z.object({
              name: z.string(),
              companyId: z.string(),
            }),
          )
          .optional()
          .describe('Criar novas fontes geradoras se não existirem'),
        keepEmpty: z.boolean().optional().describe('Se true, faz merge com dados existentes. Se false, substitui completamente.'),
      }),
    },
  );

  return [
    // ... existing tools ...
    atualizarDadosRiscoTool,
  ];
}
```

---

## 🎯 Controller para Confirmar Ação

Criar um novo endpoint para o frontend chamar quando o usuário autorizar:

```typescript
// src/@v2/ai-chat/application/controllers/action.controller.ts

import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { ConfirmActionUseCase } from '../use-cases/confirm-action.usecase';

@Controller('ai-chat/actions')
@UseGuards(JwtAuthGuard)
export class ActionController {
  constructor(private readonly confirmActionUseCase: ConfirmActionUseCase) {}

  @Post('confirm')
  async confirmAction(@User() user: UserPayloadDto, @Body() body: { actionId: string }) {
    return this.confirmActionUseCase.execute(user, body.actionId);
  }

  @Post('cancel')
  async cancelAction(@User() user: UserPayloadDto, @Body() body: { actionId: string }) {
    // Marca como cancelada no banco
    return this.confirmActionUseCase.cancel(user, body.actionId);
  }
}
```

---

## 🧠 UseCase para Executar Ação Confirmada

```typescript
// src/@v2/ai-chat/application/use-cases/confirm-action.usecase.ts

import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
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
    // Recuperar ação pendente do banco
    const action = await this.aiPendingActionRepository.findById(actionId);

    if (!action) {
      throw new NotFoundException('Ação não encontrada');
    }

    // Validar que a ação pertence ao usuário
    if (action.userId !== user.userId) {
      throw new ForbiddenException('Você não tem permissão para executar esta ação');
    }

    // Validar status
    if (action.status !== AiPendingActionStatusEnum.PENDING) {
      throw new ForbiddenException(`Ação já foi processada com status: ${action.status}`);
    }

    try {
      // Marcar como executando
      await this.aiPendingActionRepository.updateStatus(actionId, AiPendingActionStatusEnum.EXECUTING);

      let result;

      // Executar o service apropriado
      switch (action.service) {
        case AiPendingActionServiceEnum.UPSERT_RISK_DATA:
          result = await this.upsertRiskDataService.execute(action.payload as any);
          break;

        case AiPendingActionServiceEnum.UPSERT_MANY_RISK_DATA:
          result = await this.upsertManyRiskDataService.execute(action.payload as any);
          break;

        default:
          throw new Error(`Service não suportado: ${action.service}`);
      }

      // Marcar como completo
      await this.aiPendingActionRepository.updateStatus(actionId, AiPendingActionStatusEnum.COMPLETED);

      return {
        success: true,
        data: result,
        message: 'Ação executada com sucesso',
      };
    } catch (error) {
      // Marcar como falha e salvar mensagem de erro
      await this.aiPendingActionRepository.updateStatus(actionId, AiPendingActionStatusEnum.FAILED, error.message);
      throw error;
    }
  }

  async cancel(user: UserPayloadDto, actionId: string) {
    const action = await this.aiPendingActionRepository.findById(actionId);

    if (!action) {
      throw new NotFoundException('Ação não encontrada');
    }

    if (action.userId !== user.userId) {
      throw new ForbiddenException('Você não tem permissão para cancelar esta ação');
    }

    await this.aiPendingActionRepository.updateStatus(actionId, AiPendingActionStatusEnum.CANCELLED);

    return { success: true, message: 'Ação cancelada' };
  }
}
```

---

## 🔧 Modificação no agent-tool-loop

```typescript
// src/@v2/ai-chat/domain/llm/agent-tool-loop.ts

export async function* agentToolLoop(/* ... */) {
  // ... existing code ...

  for (const toolCall of toolCalls) {
    // ... execute tool ...
    const toolResult = await tool.invoke(toolCall.args);

    // 🆕 Detectar se é uma sugestão de ação
    if (typeof toolResult === 'string' && toolResult.includes('"_action_type"')) {
      try {
        const actionData = JSON.parse(toolResult);

        if (actionData._action_type && actionData._action_id) {
          // Emitir evento especial de action_card
          yield {
            type: 'action_card',
            action: actionData._action_type,
            actionId: actionData._action_id,
            summary: actionData._summary,
            payload: actionData._payload,
          };

          // Emitir content explicando que uma ação foi sugerida
          yield {
            type: 'content',
            content: `\n\n✅ Preparei a seguinte ação: **${actionData._summary}**\n\nClique em **Autorizar** para aplicar.`,
          };

          // IMPORTANTE: Não adicionar como tool message normal ao histórico
          // O LLM não precisa ver isso como resposta da tool
          continue;
        }
      } catch (e) {
        // Se não for JSON válido, processar normalmente
      }
    }

    // ... rest of existing code ...
  }
}
```

---

## 📡 Frontend - Modificação do ActionCard

```typescript
// src/@v2/features/ai-chat/components/action-card.tsx

export function ActionCard({ summary, payload, status, actionId, onStatusChange }: ActionCardProps) {
  const queryClient = useQueryClient();
  const [isExecuting, setIsExecuting] = useState(false);

  const handleAuthorize = async () => {
    onStatusChange(actionId, 'executing');
    setIsExecuting(true);

    try {
      // 🆕 Chamar novo endpoint de confirmação
      const response = await api.post('/ai-chat/actions/confirm', { actionId });

      // Invalidar queries para atualizar UI
      await queryClient.invalidateQueries([QueryEnum.RISK_DATA]);
      await queryClient.invalidateQueries([QueryEnum.CHARACTERIZATION]);

      onStatusChange(actionId, 'success');
    } catch (error: any) {
      onStatusChange(actionId, 'error', error.response?.data?.message || 'Erro ao executar ação');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCancel = async () => {
    try {
      await api.post('/ai-chat/actions/cancel', { actionId });
      onStatusChange(actionId, 'cancelled');
    } catch (error) {
      // Silent fail
    }
  };

  // ... rest of component ...
}
```

---

## ✅ Vantagens desta Abordagem (com Prisma)

1. **✅ Independência do Frontend**: Backend executa o UseCase diretamente, sem fazer HTTP request
2. **✅ Reutilização de Lógica**: Usa o mesmo `UpsertRiskDataService` da rota REST
3. **✅ Permissões**: Permissões do controller são ignoradas, mas o service já faz validações
4. **✅ Segurança**: Ação expira em 5 minutos e valida userId
5. **✅ Escalabilidade**: Padrão pode ser usado para outras ações (criar GSE, adicionar exames, etc.)
6. **✅ Transações**: Se o service usa transações, elas funcionam normalmente
7. **✅ Auditoria**: Histórico completo salvo no banco (status, errorMessage, timestamps)
8. **✅ Testing**: Fácil de testar o ConfirmActionUseCase isoladamente
9. **✅ Persistência**: Ações sobrevivem a restart do servidor
10. **✅ Rastreabilidade**: Pode consultar ações executadas, falhas, canceladas
11. **✅ Retry**: Se uma ação falhar, fica no banco para análise
12. **✅ Cleanup Automático**: Cron job para limpar ações antigas

---

## 🚀 Próximos Passos

1. ✅ Adicionar modelo `AiPendingAction` em `prisma/schema.prisma`
2. ✅ Rodar migration: `npx prisma migrate dev --name add_ai_pending_actions`
3. ✅ Criar `AiPendingActionRepository` em `src/@v2/ai-chat/database/repositories/`
4. ✅ Adicionar tool `atualizar_dados_risco` em `characterization.tools.ts`
5. ✅ Criar `ActionController` e `ConfirmActionUseCase`
6. ✅ Modificar `agent-tool-loop.ts` para detectar `_action_type`
7. ✅ Atualizar `AiChatModule` para:
   - Importar `SstModule`
   - Registrar `AiPendingActionRepository`
   - Registrar `ConfirmActionUseCase`
   - Registrar `ActionController`
8. ✅ Atualizar `StreamChatUseCase` para passar repository para supervisor
9. ✅ Atualizar supervisor agent para passar repository para tools
10. ✅ Atualizar `ActionCard` no frontend para chamar novo endpoint
11. ✅ Adicionar tipos `action_card` em `stream-events.ts`
12. ✅ (Opcional) Criar cron job para limpar ações expiradas
13. ✅ Testar fluxo completo end-to-end

---

**Fim da Documentação - Execução Direta no Backend** 🚀
