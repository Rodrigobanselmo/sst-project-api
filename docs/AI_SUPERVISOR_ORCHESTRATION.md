# 🎯 Arquitetura de Orquestração do Supervisor

## Visão Geral

O **Supervisor Agent** é o orquestrador central que gerencia sub-agentes especializados e pode executar tarefas próprias.

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────┐
│                 SUPERVISOR AGENT                     │
│  - Classifica intenção                              │
│  - Delega para sub-agentes                          │
│  - Coleta e processa respostas                      │
│  - Pode chamar múltiplos agentes em sequência       │
│  - Tem suas próprias ferramentas (futuro)           │
└─────────────────────────────────────────────────────┘
         │                │              │
         ▼                ▼              ▼
┌──────────────┐  ┌─────────────┐  ┌──────────────┐
│ User Agent   │  │ Document    │  │ Characteriz. │
│              │  │ Agent       │  │ Agent        │
│ - Usuários   │  │ - Docs      │  │ - Riscos     │
│ - Funcion.   │  │ - Relatórios│  │ - Cargos     │
└──────────────┘  └─────────────┘  └──────────────┘
```

## 📊 Fluxo de Execução

### Exemplo 1: Delegação Simples
```
Usuário: "Liste os cargos da empresa"
   ↓
Supervisor classifica → "characterization"
   ↓
Chama Characterization Agent
   ↓
Coleta resposta (subAgentResponse)
   ↓
Retorna ao usuário
```

### Exemplo 2: Orquestração Múltipla (Futuro)
```
Usuário: "Busque cargos com risco químico e crie um relatório"
   ↓
Supervisor analisa → tarefa complexa
   ↓
1. Chama Characterization Agent → obtém cargos
   ↓ (coleta resposta em subAgentResponse)
   ↓
2. Processa resultados
   ↓
3. Chama Document Agent → cria relatório
   ↓ (coleta resposta)
   ↓
4. Combina e apresenta resultado final
```

## 🔧 Implementação Atual

### 1. Classificação de Intenção

**Arquivo:** `src/@v2/ai-chat/domain/agents/supervisor-agent.ts`

```typescript
async function classifyIntent(...)
```

**Categorias:**
- `user` - Usuários/funcionários
- `document` - Documentos
- `characterization` - Riscos/cargos/GHE
- `general` - Perguntas gerais sobre sistema

### 2. Agentes Disponíveis

#### General Agent
- **Quando:** Perguntas gerais, ajuda, sistema
- **Prompt:** `SUPERVISOR_ORCHESTRATION_PROMPT`
- **Tools:** Nenhuma (por enquanto)
- **Função:** `streamGeneralSupervisor()`

#### User Agent
- **Quando:** Gerenciar usuários/colaboradores
- **Tools:** `list_users`, `reread_file`
- **Arquivo:** `user-agent.ts`

#### Document Agent
- **Quando:** Gerar/gerenciar documentos
- **Status:** Em desenvolvimento
- **Arquivo:** `document-agent.ts`

#### Characterization Agent
- **Quando:** Riscos, cargos, GHE, ambientes
- **Tools:** `buscar_hierarquias`, `buscar_riscos`, etc.
- **Arquivo:** `characterization-agent.ts`

### 3. Coleta de Respostas

```typescript
let subAgentResponse = '';  // Acumula resposta do sub-agente

for await (const event of streamCharacterizationAgent(...)) {
  if (event.type === 'content') {
    subAgentResponse += event.content;  // ✅ Coleta
  }
  yield event;  // Repassa para frontend
}

// subAgentResponse contém a resposta completa do sub-agente
// Supervisor pode processar/combinar/analisar
```

## 🚀 Como Adicionar Ferramentas ao Supervisor

### Cenário: Adicionar ferramentas de "ajuda do sistema"

**1. Criar as ferramentas**

`src/@v2/ai-chat/domain/tools/supervisor.tools.ts`:
```typescript
import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

export function createSupervisorTools() {
  const listSystemFeatures = new DynamicStructuredTool({
    name: 'listar_funcionalidades_sistema',
    description: 'Lista funcionalidades disponíveis no sistema SST',
    schema: z.object({}),
    func: async () => {
      return JSON.stringify({
        features: [
          'Gestão de Riscos',
          'Caracterização de Ambientes',
          'Geração de Documentos (PGR, PCMSO)',
          'Gestão de Usuários',
        ]
      });
    },
  });

  return [listSystemFeatures];
}
```

**2. Usar no General Agent**

Modificar `streamGeneralSupervisor`:
```typescript
import { agentToolLoop } from '../llm/agent-tool-loop';
import { createSupervisorTools } from '../tools/supervisor.tools';
import { createFileTools } from '../tools/file.tools';

async function* streamGeneralSupervisor(input) {
  const supervisorTools = createSupervisorTools();
  const fileTools = input.additionalTools ?? [];
  const tools = [...supervisorTools, ...fileTools];

  const messages = [
    new SystemMessage(SUPERVISOR_ORCHESTRATION_PROMPT),
    ...historyMessages,
    currentUserMessage
  ];

  yield* agentToolLoop({
    llm: input.llm,
    messages,
    tools,
    callbacks: input.callbacks,
  });
}
```

## 📝 Próximos Passos

### Fase 1: ✅ Completado
- [x] Supervisor classifica intenção
- [x] Delega para sub-agentes
- [x] Coleta respostas (subAgentResponse)
- [x] Tracking de conteúdo gerado

### Fase 2: 🚧 Em Progresso
- [ ] Adicionar ferramentas ao General Agent
- [ ] Implementar orquestração multi-agente
- [ ] Supervisor processar/combinar respostas

### Fase 3: 📅 Futuro
- [ ] Supervisor decidir chamar múltiplos agentes
- [ ] Supervisor resumir/sintetizar respostas combinadas
- [ ] Ferramentas de análise e relatórios no supervisor
