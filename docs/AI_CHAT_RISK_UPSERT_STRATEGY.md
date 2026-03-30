# Estratégia: Atualização de Riscos via AI Chat com Autorização

## 📋 Visão Geral

Este documento descreve a arquitetura para permitir que usuários atualizem riscos, recomendações e EPIs através do AI Chat, utilizando um **Card de Autorização** que aparece no chat antes de executar a ação.

### Fluxo Proposto

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Usuário faz pedido no chat                                  │
│    "Adicione o EPI Luvas ao risco de Ruído no GSE Produção"    │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. LLM classifica intent → characterization agent              │
│    Agent usa ferramenta: suggest_risk_update                    │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. Backend retorna StreamEvent tipo "action_card"              │
│    {                                                            │
│      type: "action_card",                                       │
│      action: "upsert_risk_data",                                │
│      payload: { ... dados do upsert ... },                      │
│      summary: "Adicionar EPI Luvas ao risco de Ruído..."       │
│    }                                                            │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. Frontend renderiza ActionCard no chat                       │
│    ┌──────────────────────────────────────────────────┐        │
│    │ 🔔 Ação Pendente                                 │        │
│    │ Adicionar EPI Luvas ao risco de Ruído no GSE... │        │
│    │                                                  │        │
│    │ [Autorizar] [Cancelar]                           │        │
│    └──────────────────────────────────────────────────┘        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. Usuário clica em "Autorizar"                                │
│    Frontend executa useMutUpsertRiskData(payload)               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. Backend processa upsert (POST /risk-data)                   │
│    Retorna: IRiskData atualizado                                │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 7. Frontend invalida queries (React Query)                     │
│    UI da RiskToolV2 atualiza automaticamente                   │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 8. Card no chat muda para "✓ Executado"                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Arquitetura de Implementação

### 1. **Backend - Nova Tool: `suggest_risk_update`**

**Arquivo:** `src/@v2/ai-chat/domain/tools/characterization.tools.ts`

Criar uma nova tool que o LLM pode chamar quando detectar uma intenção de atualizar riscos:

```typescript
const suggestRiskUpdateTool = tool(
  async ({ action, payload, summary }) => {
    // Esta tool NÃO executa a ação, apenas retorna um JSON
    // que será transformado em StreamEvent tipo "action_card"
    return JSON.stringify({
      _action_type: 'upsert_risk_data',
      _summary: summary,
      _payload: payload,
    });
  },
  {
    name: 'sugerir_atualizacao_risco',
    description:
      'Sugere uma atualização de risco/EPIs/recomendações que requer autorização do usuário. ' +
      'Use esta ferramenta quando o usuário pedir para ADICIONAR, REMOVER ou ATUALIZAR riscos, EPIs, medidas de controle, recomendações, etc. ' +
      'IMPORTANTE: Esta ferramenta NÃO executa a ação diretamente - ela retorna um card de autorização para o usuário aprovar.',
    schema: z.object({
      _actionDescription: z.string().describe('Breve descrição do que você está fazendo'),
      action: z.literal('upsert_risk_data').describe('Tipo de ação'),
      summary: z.string().describe('Resumo claro da ação para mostrar ao usuário (ex: "Adicionar EPI Luvas ao risco de Ruído no GSE Produção")'),
      payload: z
        .object({
          riskId: z.string().uuid().describe('ID do risco (RiskFactor)'),
          homogeneousGroupId: z.string().uuid().optional().describe('ID do GSE'),
          hierarchyId: z.string().optional().describe('ID da hierarquia'),
          riskFactorGroupDataId: z.string().uuid().describe('ID do PGR'),
          epis: z
            .array(
              z.object({
                epiId: z.number(),
                efficientlyCheck: z.boolean().optional(),
                ca: z.string().optional(),
              }),
            )
            .optional(),
          recs: z.array(z.string()).optional(),
          adms: z.array(z.string()).optional(),
          probability: z.number().min(1).max(5).optional(),
          // ... demais campos do IUpsertRiskData
        })
        .describe('Payload completo para POST /risk-data'),
    }),
  },
);
```

**Integração com agentToolLoop:**

Modificar `src/@v2/ai-chat/domain/llm/agent-tool-loop.ts` para detectar respostas especiais de tools:

```typescript
// Após executar a tool
const toolResult = await tool.invoke(toolCall.args);

// Detectar se é uma sugestão de ação
if (typeof toolResult === 'string' && toolResult.includes('"_action_type"')) {
  const actionData = JSON.parse(toolResult);

  // Emitir evento especial de action_card
  yield {
    type: 'action_card',
    action: actionData._action_type,
    summary: actionData._summary,
    payload: actionData._payload,
    id: generateUniqueId(), // ID único para tracking
  };

  // Emitir content explicando que uma ação foi sugerida
  yield {
    type: 'content',
    content: `\n\n✅ Preparei a seguinte ação: **${actionData._summary}**\n\nClique em **Autorizar** para aplicar.`,
  };

  continue; // Não adicionar como tool message normal
}
```

---

### 2. **Backend - Novo StreamEvent Type**

**Arquivo:** `src/@v2/ai-chat/domain/types/stream-events.ts`

```typescript
export type StreamEvent =
  | { type: 'content'; content: string }
  | { type: 'tool_start'; tool: string; args: Record<string, unknown>; description: string }
  | { type: 'tool_end'; tool: string; result: string; success: boolean }
  | { type: 'agent_start'; agent: AgentType; name: string; description: string }
  | { type: 'agent_end'; agent: AgentType; success: boolean }
  | { type: 'error'; message: string }
  | {
      type: 'action_card';
      action: 'upsert_risk_data' | 'upsert_many_risk_data';
      summary: string;
      payload: Record<string, unknown>;
      id: string;
    };
```

---

### 3. **Frontend - Tipos e Interfaces**

**Arquivo:** `src/@v2/features/ai-chat/hooks/use-ai-chat-stream.ts`

```typescript
export interface ChatMessage {
  role: 'user' | 'assistant' | 'tool' | 'agent' | 'action';
  content: string;
  toolName?: string;
  toolStatus?: 'running' | 'success' | 'error';
  toolDescription?: string;
  agentName?: string;
  timestamp: Date;
  files?: ChatMessageAttachment[];
  // Novo: dados de ação
  actionData?: {
    type: 'upsert_risk_data' | 'upsert_many_risk_data';
    summary: string;
    payload: any;
    status: 'pending' | 'executing' | 'success' | 'error' | 'cancelled';
    id: string;
    error?: string;
  };
}

type StreamEvent =
  | { type: 'content'; content: string }
  | { type: 'tool_start'; tool: string; args: Record<string, unknown>; description: string }
  | { type: 'tool_end'; tool: string; result: string; success: boolean }
  | { type: 'agent_start'; agent: string; name: string; description: string }
  | { type: 'agent_end'; agent: string; success: boolean }
  | { type: 'error'; message: string }
  | {
      type: 'action_card';
      action: 'upsert_risk_data' | 'upsert_many_risk_data';
      summary: string;
      payload: Record<string, unknown>;
      id: string;
    };
```

**Atualizar `sendMessage` para processar action_card:**

```typescript
for await (const line of lines) {
  // ... parsing ...

  if (event.type === 'action_card') {
    // Criar mensagem de ação pendente
    const actionMessage: ChatMessage = {
      role: 'action',
      content: '', // Vazio, o card vai renderizar o summary
      timestamp: new Date(),
      actionData: {
        type: event.action,
        summary: event.summary,
        payload: event.payload,
        status: 'pending',
        id: event.id,
      },
    };
    setMessages((prev) => [...prev, actionMessage]);
  }
}
```

---

### 4. **Frontend - Componente ActionCard**

**Arquivo:** `src/@v2/features/ai-chat/components/action-card.tsx`

```typescript
import { useState } from 'react';
import { CheckCircle, Cancel, HourglassEmpty, Error as ErrorIcon } from '@mui/icons-material';
import { useMutUpsertRiskData } from 'core/services/hooks/mutations/checklist/riskData/useMutUpsertRiskData';
import { useQueryClient } from '@tanstack/react-query';
import { QueryEnum } from 'core/enums/query.enums';
import styles from './action-card.module.css';

interface ActionCardProps {
  summary: string;
  payload: any;
  status: 'pending' | 'executing' | 'success' | 'error' | 'cancelled';
  actionId: string;
  onStatusChange: (actionId: string, status: 'executing' | 'success' | 'error' | 'cancelled', error?: string) => void;
}

export function ActionCard({ summary, payload, status, actionId, onStatusChange }: ActionCardProps) {
  const queryClient = useQueryClient();
  const upsertRiskData = useMutUpsertRiskData();

  const handleAuthorize = async () => {
    onStatusChange(actionId, 'executing');

    try {
      await upsertRiskData.mutateAsync(payload);

      // Invalidar queries para atualizar UI
      await queryClient.invalidateQueries([QueryEnum.RISK_DATA]);

      onStatusChange(actionId, 'success');
    } catch (error: any) {
      onStatusChange(actionId, 'error', error.message || 'Erro ao executar ação');
    }
  };

  const handleCancel = () => {
    onStatusChange(actionId, 'cancelled');
  };

  return (
    <div className={`${styles.actionCard} ${styles[status]}`}>
      <div className={styles.header}>
        {status === 'pending' && <HourglassEmpty className={styles.icon} />}
        {status === 'executing' && <HourglassEmpty className={`${styles.icon} ${styles.spinning}`} />}
        {status === 'success' && <CheckCircle className={`${styles.icon} ${styles.success}`} />}
        {status === 'error' && <ErrorIcon className={`${styles.icon} ${styles.error}`} />}
        {status === 'cancelled' && <Cancel className={`${styles.icon} ${styles.cancelled}`} />}

        <span className={styles.title}>
          {status === 'pending' && '🔔 Ação Pendente'}
          {status === 'executing' && '⏳ Executando...'}
          {status === 'success' && '✅ Executado'}
          {status === 'error' && '❌ Erro'}
          {status === 'cancelled' && '🚫 Cancelado'}
        </span>
      </div>

      <div className={styles.summary}>{summary}</div>

      {status === 'pending' && (
        <div className={styles.actions}>
          <button
            className={`${styles.button} ${styles.authorize}`}
            onClick={handleAuthorize}
            disabled={upsertRiskData.isPending}
          >
            Autorizar
          </button>
          <button
            className={`${styles.button} ${styles.cancel}`}
            onClick={handleCancel}
            disabled={upsertRiskData.isPending}
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}
```

**Arquivo CSS:** `src/@v2/features/ai-chat/components/action-card.module.css`

```css
.actionCard {
  border-radius: 8px;
  padding: 12px;
  margin: 8px 0;
  border: 1px solid var(--border-color);
  background: var(--card-background);
  transition: all 0.2s ease;
}

.actionCard.pending {
  border-left: 4px solid var(--warning-color);
  background: var(--warning-background);
}

.actionCard.executing {
  border-left: 4px solid var(--info-color);
  background: var(--info-background);
}

.actionCard.success {
  border-left: 4px solid var(--success-color);
  background: var(--success-background);
}

.actionCard.error {
  border-left: 4px solid var(--error-color);
  background: var(--error-background);
}

.actionCard.cancelled {
  border-left: 4px solid var(--grey-color);
  background: var(--grey-background);
  opacity: 0.7;
}

.header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.icon {
  font-size: 18px;
}

.icon.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.icon.success {
  color: var(--success-color);
}
.icon.error {
  color: var(--error-color);
}
.icon.cancelled {
  color: var(--grey-color);
}

.title {
  font-weight: 600;
  font-size: 14px;
}

.summary {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.actions {
  display: flex;
  gap: 8px;
}

.button {
  flex: 1;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.authorize {
  background: var(--primary-color);
  color: white;
}

.authorize:hover:not(:disabled) {
  background: var(--primary-dark);
}

.cancel {
  background: var(--grey-light);
  color: var(--text-primary);
}

.cancel:hover:not(:disabled) {
  background: var(--grey);
}
```

---

### 5. **Frontend - Integração no Sidebar**

**Arquivo:** `src/@v2/features/ai-chat/components/ai-chat-sidebar.tsx`

Modificar o loop de renderização de mensagens para incluir ActionCard:

```typescript
import { ActionCard } from './action-card';

// ... dentro do map de streamMessages ...

// Action card messages
if (msg.role === 'action' && msg.actionData) {
  return (
    <div key={index} className={styles.actionMessageContainer}>
      <ActionCard
        summary={msg.actionData.summary}
        payload={msg.actionData.payload}
        status={msg.actionData.status}
        actionId={msg.actionData.id}
        onStatusChange={(actionId, newStatus, error) => {
          // Atualizar status da mensagem
          setStreamMessages((prev) =>
            prev.map((m) =>
              m.actionData?.id === actionId
                ? {
                    ...m,
                    actionData: {
                      ...m.actionData!,
                      status: newStatus,
                      ...(error ? { error } : {}),
                    },
                  }
                : m
            )
          );
        }}
      />
    </div>
  );
}
```

---

### 6. **Frontend - Hook para gerenciar ações**

**Arquivo:** `src/@v2/features/ai-chat/hooks/use-ai-chat-stream.ts`

Adicionar callback para atualizar status de ações:

```typescript
export function useAIChatStream() {
  // ... existing state ...

  const updateActionStatus = (actionId: string, status: 'executing' | 'success' | 'error' | 'cancelled', error?: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.actionData?.id === actionId
          ? {
              ...msg,
              actionData: {
                ...msg.actionData,
                status,
                ...(error ? { error } : {}),
              },
            }
          : msg,
      ),
    );
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    stopStream,
    updateActionStatus, // Novo
  };
}
```

---

## 📝 Exemplos de Uso

### Exemplo 1: Adicionar EPI a um risco

**Input do usuário:**

```
Adicione o EPI "Luvas de Segurança" ao risco de Ruído no GSE Produção
```

**Processamento:**

1. LLM classifica → `characterization` agent
2. Agent chama `buscar_riscos_por_tipo` para encontrar o risco de Ruído
3. Agent chama `buscar_grupos_homogeneos` para encontrar o GSE "Produção"
4. Agent chama `obter_detalhes_risco` para validar dados
5. Agent chama `sugerir_atualizacao_risco` com payload:

```json
{
  "action": "upsert_risk_data",
  "summary": "Adicionar EPI 'Luvas de Segurança' (EPI #15) ao risco 'Ruído' no GSE 'Produção'",
  "payload": {
    "riskId": "uuid-do-risco-ruido",
    "homogeneousGroupId": "uuid-do-gse-producao",
    "riskFactorGroupDataId": "uuid-do-pgr",
    "epis": [
      {
        "epiId": 15,
        "efficientlyCheck": true,
        "ca": "12345"
      }
    ],
    "keepEmpty": true
  }
}
```

6. Frontend exibe ActionCard
7. Usuário clica em "Autorizar"
8. Frontend executa `useMutUpsertRiskData`
9. Backend atualiza banco
10. React Query invalida cache
11. UI da RiskToolV2 atualiza automaticamente

---

### Exemplo 2: Atualizar probabilidade

**Input do usuário:**

```
Mude a probabilidade do risco de Calor no GSE Manutenção para nível 4
```

**Payload gerado:**

```json
{
  "action": "upsert_risk_data",
  "summary": "Atualizar probabilidade do risco 'Calor' no GSE 'Manutenção' para nível 4",
  "payload": {
    "riskId": "uuid-do-risco-calor",
    "homogeneousGroupId": "uuid-do-gse-manutencao",
    "riskFactorGroupDataId": "uuid-do-pgr",
    "probability": 4,
    "keepEmpty": true
  }
}
```

---

### Exemplo 3: Adicionar recomendação

**Input do usuário:**

```
Adicione a recomendação "Realizar treinamento NR-10" ao risco de Choque Elétrico no cargo de Eletricista
```

**Processamento:**

1. Agent busca hierarquia (cargo)
2. Agent busca risco
3. Agent busca/cria recomendação usando `recAddOnly` se não existir

**Payload:**

```json
{
  "action": "upsert_risk_data",
  "summary": "Adicionar recomendação 'Realizar treinamento NR-10' ao risco 'Choque Elétrico' no cargo 'Eletricista'",
  "payload": {
    "riskId": "uuid-do-risco-choque",
    "hierarchyId": "uuid-do-cargo-eletricista",
    "type": "HIERARCHY",
    "riskFactorGroupDataId": "uuid-do-pgr",
    "recAddOnly": [
      {
        "recName": "Realizar treinamento NR-10",
        "companyId": "uuid-da-empresa",
        "recType": "ENG"
      }
    ],
    "keepEmpty": true
  }
}
```

---

## 🔄 Contexto da Página

Para o LLM ter acesso ao contexto atual da página (GSE selecionado, hierarquia, etc.), o `PageContext` já é enviado no `sendMessage`:

```typescript
const pageContext = usePageContext(); // Hook existente

sendMessage({
  message: userInput,
  pageContext, // ← Inclui companyId, ghoId, hierarchyId, path
});
```

O LLM pode usar isso para pré-selecionar o GSE/hierarquia correto:

```
Sistema: O usuário está visualizando o GSE "Produção" (ID: abc123).
Usuário: Adicione o EPI Luvas ao risco de Ruído
LLM: → usa homogeneousGroupId: "abc123" automaticamente
```

---

## 🚀 Plano de Implementação

### Fase 1: Backend (API)

1. ✅ Adicionar novo `StreamEvent` type `action_card`
2. ✅ Criar tool `sugerir_atualizacao_risco` em `characterization.tools.ts`
3. ✅ Modificar `agent-tool-loop.ts` para detectar e emitir `action_card`
4. ✅ Testar streaming de action_card via Postman/curl

### Fase 2: Frontend (Client) - Tipos

1. ✅ Atualizar `ChatMessage` interface em `use-ai-chat-stream.ts`
2. ✅ Atualizar `StreamEvent` type
3. ✅ Adicionar processamento de `action_card` no `sendMessage`

### Fase 3: Frontend - UI

1. ✅ Criar componente `ActionCard` com estados
2. ✅ Criar CSS module
3. ✅ Integrar no `ai-chat-sidebar.tsx`
4. ✅ Adicionar callback `updateActionStatus` no hook

### Fase 4: Testes e Ajustes

1. Testar fluxo completo end-to-end
2. Ajustar prompts do LLM para melhor detecção de intent
3. Adicionar loading states e erro handling
4. Validar que queries são invalidadas corretamente

---

## 🎯 Benefícios da Abordagem

1. **Segurança**: Usuário sempre autoriza antes de modificar dados
2. **Transparência**: Card mostra exatamente o que será alterado
3. **UX**: Fluxo natural de conversação + confirmação visual
4. **Rastreabilidade**: Cada ação tem ID único para audit log
5. **Escalabilidade**: Padrão pode ser reutilizado para outras ações (criar GSE, adicionar exames, etc.)
6. **Consistência**: Usa o mesmo sistema de mutations já existente
7. **Real-time**: UI atualiza automaticamente via React Query

---

## 📌 Considerações Importantes

### Merge de EPIs/Recomendações

O LLM precisa entender que EPIs e recomendações são **merged** (não substituídos). A tool deve:

- Buscar dados existentes via `obter_caracterizacao_risco`
- Fazer merge manual no payload
- Ou usar `keepEmpty: true` e confiar no backend

### Contexto de Empresa

O `companyId` vem do `PageContext` e do JWT do usuário. O LLM não precisa pedir.

### Permissões

O backend já valida permissões. Se o usuário não tiver `PermissionEnum.RISK_DATA`, o mutation vai falhar e o ActionCard mostrará erro.

### IDs vs Nomes

O LLM precisa converter nomes (ex: "GSE Produção") em IDs usando as tools de busca antes de chamar `suggest_risk_update`.

---

**Fim da Estratégia**
