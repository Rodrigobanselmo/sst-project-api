# Migration: form_application_business_group_scope

## Objetivo

Suportar aplicações de formulário no modo `BUSINESS_GROUP_COMPANIES` sem alterar registros existentes.

## Alterações

1. **Enum** `FormApplicationScopeTypeEnum`
   - `COMPANY_WORKSPACES` (default)
   - `BUSINESS_GROUP_COMPANIES`

2. **`FormApplication`**
   - `scope_type` NOT NULL, default `COMPANY_WORKSPACES`
   - `company_group_id` INTEGER NULL, FK → `CompanyGroup(id)` ON DELETE SET NULL

3. **Tabela** `FormApplicationCompany`
   - `id` (cuid)
   - `form_application_id` → `FormApplication`
   - `company_id` → `Company`
   - UNIQUE (`form_application_id`, `company_id`)

## Compatibilidade

- Aplicações existentes recebem `scope_type = COMPANY_WORKSPACES` automaticamente.
- Nenhuma coluna obrigatória removida.
- `FormParticipantsWorkspace` / `FormParticipantsHierarchy` permanecem para o modo atual.

## Rollback

- Dropar FKs, tabela `FormApplicationCompany`, colunas novas e enum (apenas se não houver dados no modo grupo).
