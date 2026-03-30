# AI Chat - Backend-Driven Risk Update Implementation Status

## ✅ Implemented Components

### 1. **Database Layer** ✅

- **File**: `prisma/schema.prisma`
- **Model**: `AiPendingAction`
  - Linked to `AiMessage` (mandatory `messageId`)
  - No `threadId` (retrieved via join)
  - No expiration - actions don't expire
  - Status: PENDING, EXECUTING, COMPLETED, FAILED, CANCELLED
- **Migration**: ⏳ Needs to be run: `npx prisma migrate dev --name add_ai_pending_actions`

### 2. **Repository** ✅

- **File**: `src/@v2/ai-chat/database/repositories/ai-pending-action.repository.ts`
- **Methods**:
  - `create()` - Create new pending action
  - `findById()` - Find action by ID
  - `findByMessage()` - Find actions by message ID
  - `findByThread()` - Find actions by thread (via join)
  - `updateStatus()` - Update action status
  - `cleanOldActions()` - Cleanup old completed/cancelled actions

### 3. **Use Cases** ✅

- **File**: `src/@v2/ai-chat/application/use-cases/confirm-action.usecase.ts`
- **Methods**:
  - `execute()` - Confirms and executes pending action
  - `cancel()` - Cancels pending action
- **Features**:
  - Routes to appropriate service based on `AiPendingActionServiceEnum`
  - Handles `UPSERT_RISK_DATA` and `UPSERT_MANY_RISK_DATA`
  - Updates status to EXECUTING → COMPLETED or FAILED
  - Error handling with error messages stored

### 4. **Controller** ✅

- **File**: `src/@v2/ai-chat/application/controllers/action.controller.ts`
- **Endpoints**:
  - `POST /ai-chat/actions/:actionId/confirm` - Confirm action
  - `POST /ai-chat/actions/:actionId/cancel` - Cancel action
- **Auth**: JwtAuthGuard
- **Validation**: Ownership and status checks

### 5. **Module Configuration** ✅

- **File**: `src/@v2/ai-chat/ai-chat.module.ts`
- **Updates**:
  - Imported `SSTModule` (with `forwardRef`)
  - Registered `AiPendingActionRepository`
  - Registered `ConfirmActionUseCase`
  - Registered `ActionController`

### 6. **Agent Tool Loop** ✅

- **File**: `src/@v2/ai-chat/domain/llm/agent-tool-loop.ts`
- **Feature**: Detects `_action_type` in tool results and emits `action_card` SSE event
- **Logic**:
  - Parses tool result JSON
  - Checks for `_action_type` and `_action_id`
  - Emits SSE event with actionId, summary, and details

### 7. **Stream Events** ✅

- **File**: `src/@v2/ai-chat/domain/types/stream-events.ts`
- **Added**: `action_card` event type with actionId, summary, and details

### 8. **AI Tool - Propose Risk Update** ✅

- **File**: `src/@v2/ai-chat/domain/tools/characterization.tools.ts`
- **Tool Name**: `propor_atualizacao_risco`
- **Features**:
  - Creates `AiPendingAction` record **using Prisma directly** (no repository)
  - Supports EPIs, recs, engs, adms, generateSources, probability, etc.
  - Returns special JSON format to trigger action_card SSE
  - Only available when userId and messageId are provided
- **Parameters**:
  - `riskId` (required)
  - `groupId` OR `hierarchyId` (one required)
  - `epis`, `recs`, `engs`, `adms`, `generateSources` (optional arrays)
  - `probability`, `probabilityAfter`, `activities`, `startDate`, `endDate` (optional)

---

## ⏳ Pending Work

### Backend

1. **Pass dependencies through the chain**:
   - Need to pass `userId` and `messageId` from:
     - `StreamChatUseCase` → `supervisorAgent` → `characterizationAgent` → `createCharacterizationTools`
   - **Note**: Now using Prisma directly (no repository needed)

2. **Message ID Problem**:
   - `messageId` only exists AFTER saving the assistant message
   - Tools are created BEFORE the agent starts generating the response
   - **Solutions**:
     - Option A: Create message record before agent loop (with empty content), update after
     - Option B: Use closure/callback to inject messageId after message is saved
     - Option C: Create action without messageId, update it after (requires schema change)

### Frontend

1. **Detect `action_card` SSE event** in `useAIChatStream` hook
2. **Render `<ActionCard>` component** in message stream
3. **Implement confirmation buttons** ("Autorizar" / "Cancelar")
4. **Call endpoints**:
   - `POST /ai-chat/actions/:id/confirm`
   - `POST /ai-chat/actions/:id/cancel`
5. **Handle action status updates** (EXECUTING, COMPLETED, FAILED)
6. **Invalidate queries** after confirmation to refresh UI data

---

## 🧪 Testing Steps

1. **Run migration**:

   ```bash
   npx prisma migrate dev --name add_ai_pending_actions
   npx prisma generate
   ```

2. **Test tool availability** (after implementing dependency passing):
   - Tool should only appear when repository + userId + messageId are available
   - Tool should not appear in fallback/standalone characterization agent calls

3. **Test full flow**:
   - User: "Adicione EPI Luvas ao risco de Ruído no grupo Produção"
   - Agent calls `propor_atualizacao_risco` tool
   - Frontend shows action card
   - User clicks "Autorizar"
   - Backend executes `UpsertRiskDataService`
   - Frontend shows success + refreshes data
