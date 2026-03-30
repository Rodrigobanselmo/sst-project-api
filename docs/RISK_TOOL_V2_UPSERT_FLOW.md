# RiskToolV2 - Fluxo de Upsert de Riscos

## Visão Geral

Este documento explica como funciona o sistema de upsert (inserção/atualização) de dados de risco no **RiskToolV2**, incluindo riscos, recomendações, EPIs, medidas de engenharia e fontes geradoras. O fluxo envolve a integração entre frontend (React) e backend (NestJS).

---

## Arquitetura Geral

```
┌─────────────────────────────────────────────────────────────┐
│                    RiskToolV2 (Frontend)                     │
│  src/components/.../RiskToolV2/RiskTool.tsx                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  RiskToolGSEView                             │
│  Renderiza cada linha de risco por GSE/Hierarquia          │
│  Componente: RiskToolGSEViewRow                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│             RiskToolSingleRiskRow                            │
│  Interface para edição de dados de risco                    │
│  (EPIs, Recomendações, Probabilidade, etc)                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              useColumnAction Hook                            │
│  onHandleSelectSave() - Adiciona/Atualiza dados             │
│  onHandleRemoveSave() - Remove dados                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│          useMutUpsertRiskData Mutation                       │
│  Hook que chama API POST /risk-data                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                Backend API (NestJS)                          │
│  RiskDataController → UpsertRiskDataService                 │
│  Endpoints:                                                  │
│    POST /risk-data           (upsert individual)            │
│    POST /risk-data/many      (upsert múltiplo)              │
│    POST /risk-data-rec       (upsert recomendações)         │
└─────────────────────────────────────────────────────────────┘
```

---

## 1. Frontend - Componentes Principais

### 1.1 RiskToolV2 (Componente Principal)

**Arquivo:** `src/components/organisms/main/Tree/OrgTree/components/RiskToolV2/RiskTool.tsx`

**Responsabilidades:**

- Gerencia estado global (Redux) do GHO/Hierarquia selecionado
- Controla visualização (GSE, Hierarquia, Caracterização)
- Renderiza `RiskToolGSEView` quando `viewType === ViewTypeEnum.SIMPLE_BY_GROUP`

**Dados principais:**

- `riskGroupId`: ID do grupo de risco (PGR)
- `selectedGhoId`: GHO ou Hierarquia selecionada
- `viewDataType`: Tipo de visualização (GSE, HIERARCHY, CHARACTERIZATION)

---

### 1.2 RiskToolGSEView

**Arquivo:** `src/components/organisms/main/Tree/OrgTree/components/RiskToolV2/components/RiskToolViews/RiskToolGSEView/index.tsx`

**Responsabilidades:**

- Busca dados de risco do GHO selecionado via `useQueryRiskDataByGho()`
- Renderiza lista de riscos com `RiskToolGSEViewRow`
- Permite adicionar novo risco ao GHO

**Query utilizada:**

```typescript
const { data: riskDataQuery } = useQueryRiskDataByGho(riskGroupId, homoId);
```

---

### 1.3 RiskToolSingleRiskRow

**Arquivo:** `src/components/organisms/main/Tree/OrgTree/components/RiskToolV2/components/SideRowTable/SingleRisk/index.tsx`

**Responsabilidades:**

- Interface para editar dados de um risco específico
- Chama `useColumnAction()` para manipular dados
- Gerencia EPIs, Recomendações, Medidas de Engenharia, Exames

**Funções principais:**

```typescript
const handleSelect = async (values: Partial<IUpsertRiskData>) => {
  const submitData = {
    ...values,
    id: riskData?.id,
    homogeneousGroupId: homoId[0],
    riskId: risk.id,
    riskFactorGroupDataId: riskGroupId,
    type: isHierarchy ? HomoTypeEnum.HIERARCHY : undefined,
    workspaceId: isHierarchy ? homoId[1] : undefined,
  };

  await onHandleSelectSave(submitData, riskData, { keepEmpty: true });
};
```

---

## 2. Frontend - Lógica de Manipulação

### 2.1 useColumnAction Hook

**Arquivo:** `src/components/organisms/main/Tree/OrgTree/components/RiskToolV2/hooks/useColumnAction.ts`

**Função:** `onHandleSelectSave()`
Adiciona ou atualiza dados de risco, fazendo merge com dados existentes.

```typescript
const onHandleSelectSave = async ({ recs, adms, engs, epis, generateSources, exams, ...restData }: IUpsertRiskData, riskData?: IRiskData, { keepEmpty } = { keepEmpty: false }) => {
  const submitData = { ...restData };

  // Merge de recomendações (recs), administrativas (adms), fontes geradoras
  Object.entries({ recs, adms, generateSources }).forEach(([key, value]) => {
    if (value?.length) {
      submitData[key] = [...value, ...(riskData?.[key]?.map((rec) => rec.id) ?? [])];
    }
  });

  // Merge de EPIs (remove duplicados por epiId)
  if (epis?.length) {
    submitData.epis = removeDuplicate([...epis, ...(riskData?.epis?.map((epi) => epi.epiRiskData) || [])], { removeById: 'epiId' });
  }

  await upsertRiskData.mutateAsync({ ...submitData, keepEmpty });
};
```

**Função:** `onHandleRemoveSave()`
Remove itens específicos (EPIs, recomendações, etc).

```typescript
const onHandleRemoveSave = async ({ recs, adms, engs, epis, exams, generateSources, ...restData }, riskData?: IRiskData) => {
  const submitData = { ...restData };

  // Filtra itens que NÃO devem ser removidos
  Object.entries({ recs, adms, generateSources }).forEach(([key, value]) => {
    if (value?.length) {
      submitData[key] = [...(riskData?.[key]?.filter((data) => !value.includes(data.id)).map((d) => d.id) ?? [])];
    }
  });

  await upsertRiskData.mutateAsync(submitData);
};
```

---

## 3. Frontend - Mutations

### 3.1 useMutUpsertRiskData

**Arquivo:** `src/core/services/hooks/mutations/checklist/riskData/useMutUpsertRiskData/index.ts`

**Endpoint:** `POST /risk-data`

**Payload (IUpsertRiskData):**

```typescript
interface IUpsertRiskData {
  id?: string; // ID do riskData (se editando)
  companyId?: string;
  riskFactorGroupDataId: string; // ID do PGR
  riskId?: string; // ID do risco (fator de risco)
  homogeneousGroupId?: string; // ID do GSE
  hierarchyId?: string; // ID da hierarquia
  workspaceId?: string; // ID do workspace (estabelecimento)
  type?: HomoTypeEnum; // HIERARCHY | GSE

  // Dados de avaliação
  probability?: number; // Probabilidade (1-5)
  probabilityAfter?: number; // Probabilidade após controles
  exposure?: ExposureTypeEnum; // Exposição

  // Relacionamentos (IDs)
  adms?: string[]; // Medidas administrativas
  recs?: string[]; // Recomendações
  generateSources?: string[]; // Fontes geradoras

  // Relacionamentos complexos
  epis?: IEpiRiskData[]; // EPIs com dados específicos
  engs?: IEngsRiskData[]; // Medidas de engenharia
  exams?: IExamRiskData[]; // Exames

  // Flags
  keepEmpty?: boolean; // Manter mesmo se vazio
  standardExams?: boolean; // Usar exames padrão

  // Datas
  startDate?: Date;
  endDate?: Date;

  // Adicionar novos (cria se não existir)
  recAddOnly?: { recName?: string; companyId: string; recType?: RecTypeEnum }[];
  admsAddOnly?: { medName?: string; companyId: string; medType?: MedTypeEnum }[];
  engsAddOnly?: { medName?: string; companyId: string; medType?: MedTypeEnum }[];
  generateSourcesAddOnly?: { name?: string; companyId: string }[];
}
```

**OnSuccess (após sucesso):**

```typescript
onSuccess: async (resp) => {
  // Invalida queries para atualizar UI
  queryClient.invalidateQueries([QueryEnum.ENVIRONMENT]);
  queryClient.invalidateQueries([QueryEnum.EXAMS_RISK_DATA]);
  queryClient.invalidateQueries([QueryEnum.CHARACTERIZATION]);
  queryClient.invalidateQueries([QueryEnum.RISK_DATA, companyId]);
  queryClient.invalidateQueries([QueryEnum.RISK_DATA, companyId, homoId]);
};
```

---

### 3.2 useMutUpsertManyRiskData

**Arquivo:** `src/core/services/hooks/mutations/checklist/riskData/useMutUpsertManyRiskData/index.ts`

**Endpoint:** `POST /risk-data/many`

**Quando usar:** Atualizar múltiplos GSEs/Hierarquias com múltiplos riscos simultaneamente.

**Payload (IUpsertManyRiskData):**

```typescript
interface IUpsertManyRiskData {
  riskFactorGroupDataId: string;
  riskIds: string[]; // Múltiplos riscos
  homogeneousGroupIds?: string[]; // Múltiplos GSEs
  // ... demais campos similares ao IUpsertRiskData
}
```

---

### 3.3 useMutUpsertRiskDataRec

**Arquivo:** `src/core/services/hooks/mutations/checklist/riskData/useMutUpsertRiskDataRec/index.ts`

**Endpoint:** `POST /risk-data-rec`

**Quando usar:** Criar/atualizar plano de ação para recomendações específicas.

**Payload (IUpsertRiskDataRec):**

```typescript
interface IUpsertRiskDataRec {
  id?: string;
  recMedId: string; // ID da recomendação
  riskFactorDataId: string; // ID do riskData
  responsibleName?: string; // Responsável
  endDate?: string; // Prazo
  status?: StatusEnum; // Status (PENDING, DONE, etc)
  comment?: {
    text?: string;
    type?: RiskRecTypeEnum;
    textType?: RiskRecTextTypeEnum;
  };
}
```

---

## 4. Backend - Controllers

### 4.1 RiskDataController

**Arquivo:** `src/modules/sst/controller/risk-data/risk-data.controller.ts`

**Endpoints:**

#### POST /risk-data

```typescript
@Post()
@Permissions({ code: PermissionEnum.RISK_DATA, crud: 'cu' })
upsert(@Body() upsertRiskDataDto: UpsertRiskDataDto) {
  return this.upsertRiskDataService.execute(upsertRiskDataDto);
}
```

#### POST /risk-data/many

```typescript
@Post('many')
@Permissions({ code: PermissionEnum.RISK_DATA, crud: 'cu' })
upsertMany(@Body() upsertRiskDataDto: UpsertManyRiskDataDto) {
  return this.upsertManyRiskDataService.execute(upsertRiskDataDto);
}
```

#### POST /:companyId/:groupId/delete/many

```typescript
@Post('/:companyId/:groupId/delete/many')
@Permissions({ code: PermissionEnum.RISK_DATA, crud: 'd' })
delete(@Body() upsertRiskDataDto: DeleteManyRiskDataDto) {
  return this.deleteManyRiskDataService.execute(upsertRiskDataDto, companyId);
}
```

#### GET /:companyId/:riskGroupId/:riskId

```typescript
@Get('/:companyId/:riskGroupId/:riskId')
@Permissions({ code: PermissionEnum.RISK_DATA })
findAllAvailable(@Param('riskId') riskId: string, @Param('riskGroupId') groupId: string) {
  return this.findAllByGroupAndRiskService.execute(riskId, groupId, companyId);
}
```

---

### 4.2 RiskDataRecController

**Arquivo:** `src/modules/sst/controller/risk-data-rec/risk-data-rec.controller.ts`

**Endpoint:**

#### POST /risk-data-rec

```typescript
@Post()
@Permissions({ code: PermissionEnum.RISK_DATA, crud: true })
upsert(@Body() upsertRiskDataDto: UpsertRiskDataRecDto, @User() userPayloadDto: UserPayloadDto) {
  return this.upsertRiskDataRecService.execute(upsertRiskDataDto, userPayloadDto);
}
```

---

## 5. Backend - Services

### 5.1 UpsertRiskDataService

**Arquivo:** `src/modules/sst/services/risk-data/upsert-risk-data/upsert-risk.service.ts`

**Responsabilidades:**

1. Validar e processar dados de entrada
2. Criar GSE de hierarquia se `type === 'HIERARCHY'`
3. Fazer upsert do RiskData no banco
4. Processar campos "AddOnly" (criar novos se não existirem)
5. Atualizar PPP de funcionários afetados
6. Verificar necessidade de atualização de exames

**Fluxo principal:**

```typescript
async execute(upsertRiskDataDto: UpsertRiskDataDto) {
  // 1. Extrai flags e dados especiais
  const keepEmpty = upsertRiskDataDto.keepEmpty;
  const workspaceId = upsertRiskDataDto.workspaceId;
  const type = upsertRiskDataDto.type;
  const { recAddOnly, admsAddOnly, generateSourcesAddOnly, engsAddOnly } = upsertRiskDataDto;

  // 2. Se tipo HIERARCHY, cria/vincula GSE de hierarquia
  if (type === HomoTypeEnum.HIERARCHY) {
    await hierarchyCreateHomo({
      homogeneousGroupId: upsertRiskDataDto.homogeneousGroupId,
      companyId: upsertRiskDataDto.companyId,
      homoGroupRepository: this.homoGroupRepository,
      hierarchyRepository: this.hierarchyRepository,
      type,
      workspaceId,
    });
  }

  // 3. Faz upsert do RiskData
  const riskData = await this.riskDataRepository.upsert(upsertRiskDataDto);

  // 4. Atualiza exames de funcionários se necessário
  if (upsertRiskDataDto.exams) {
    this.checkEmployeeExamService.execute({
      homogeneousGroupId: upsertRiskDataDto.homogeneousGroupId,
      companyId: upsertRiskDataDto.companyId,
    });
  }

  // 5. Marca PPP para reenvio
  this.employeePPPHistoryRepository.updateManyNude({
    data: { sendEvent: true },
    where: {
      employee: {
        companyId: upsertRiskDataDto.companyId,
        hierarchyHistory: {
          some: {
            hierarchy: {
              hierarchyOnHomogeneous: {
                some: { homogeneousGroupId: upsertRiskDataDto.homogeneousGroupId }
              },
            },
          },
        },
      },
    },
  });

  // 6. Processa campos "AddOnly" (criar novos itens)
  if (recAddOnly || admsAddOnly || generateSourcesAddOnly || engsAddOnly) {
    await this.updateAddOnlyFields(upsertRiskDataDto, riskData);
  }

  // 7. Remove riskData se vazio e keepEmpty = false
  if (!keepEmpty) {
    const isEmpty =
      riskData.adms.length === 0 &&
      riskData.recs.length === 0 &&
      riskData.engs.length === 0 &&
      riskData.epis.length === 0 &&
      riskData.generateSources.length === 0 &&
      !riskData.probability;

    if (isEmpty) {
      await this.riskDataRepository.deleteById(riskData.id);
      return riskData.id; // Retorna ID como string indicando deleção
    }
  }

  return riskData;
}
```

**Função auxiliar:** `updateAddOnlyFields()`
Cria novos itens (recomendações, EPIs, etc) se ainda não existirem e os vincula ao RiskData.

---

### 5.2 UpsertManyRiskDataService

**Arquivo:** `src/modules/sst/services/risk-data/upsert-many-risk-data/upsert-many-risk-data.service.ts`

**Responsabilidades:**
Criar/atualizar RiskData para múltiplos GSEs e múltiplos riscos simultaneamente.

**Fluxo:**

```typescript
async execute(upsertRiskDataDto: UpsertManyRiskDataDto) {
  // 1. Cria GSEs de hierarquia se necessário
  await Promise.all(
    upsertRiskDataDto.homogeneousGroupIds.map(async (homogeneousGroupId, index) => {
      if (upsertRiskDataDto.type === HomoTypeEnum.HIERARCHY) {
        await hierarchyCreateHomo({
          homogeneousGroupId,
          companyId: upsertRiskDataDto.companyId,
          workspaceId: upsertRiskDataDto.workspaceIds?.[index],
          // ...
        });
      }
    })
  );

  // 2. Faz upsert para cada riskId
  const risksDataMany = await Promise.all(
    upsertRiskDataDto.riskIds.map(async (riskId) => {
      return await this.riskDataRepository.upsertConnectMany({
        ...upsertRiskDataDto,
        riskId,
      });
    })
  );

  // 3. Atualiza exames se necessário
  if (upsertRiskDataDto.exams) {
    this.checkEmployeeExamService.execute({
      homogeneousGroupIds: upsertRiskDataDto.homogeneousGroupIds,
      companyId: upsertRiskDataDto.companyId,
    });
  }

  // 4. Marca PPPs para reenvio
  this.employeePPPHistoryRepository.updateManyNude({ ... });

  return risksDataMany;
}
```

---

### 5.3 UpsertRiskDataRecService

**Arquivo:** `src/modules/sst/services/risk-data-rec/upsert-risk-data-rec/upsert-risk-data-rec.service.ts`

**Responsabilidades:**
Criar/atualizar dados de plano de ação para recomendações.

```typescript
async execute(upsertRiskDataDto: UpsertRiskDataRecDto, user: UserPayloadDto) {
  const riskDataRec = await this.riskDataRecRepository.upsert({
    ...upsertRiskDataDto,
    companyId: user.targetCompanyId,
  });
  return riskDataRec;
}
```

---

## 6. Fluxo Completo - Exemplo Prático

### Cenário: Adicionar EPI a um risco

**Passo 1 - Usuário seleciona GSE**

```
RiskToolV2 → handleSelectGHO(gho, hierarchies)
  ↓
Redux: setGhoState({ data: gho, hierarchies })
  ↓
URL atualizada: ?viewData=GSE&ghoId=abc123
```

**Passo 2 - Sistema busca riscos do GSE**

```
RiskToolGSEView → useQueryRiskDataByGho(riskGroupId, homoId)
  ↓
GET /risk-data/:companyId/:riskGroupId/:riskId
  ↓
Retorna: IRiskData[] (lista de riscos do GSE)
```

**Passo 3 - Usuário adiciona EPI**

```
RiskToolSingleRiskRow → handleSelect({ epis: [epiData] })
  ↓
useColumnAction → onHandleSelectSave()
  ↓
Merge EPIs: [...novos, ...existentes]
  ↓
useMutUpsertRiskData.mutateAsync({
  id: 'risk-data-123',
  riskId: 'risk-456',
  homogeneousGroupId: 'gho-789',
  riskFactorGroupDataId: 'pgr-001',
  epis: [
    { epiId: 10, efficientlyCheck: true, ca: '12345' },
    // ... EPIs existentes
  ],
  keepEmpty: true
})
```

**Passo 4 - Backend processa**

```
POST /risk-data
  ↓
RiskDataController.upsert()
  ↓
UpsertRiskDataService.execute()
  ↓
1. Valida dados
2. riskDataRepository.upsert() → Prisma upsert
3. Atualiza PPP de funcionários
4. Invalida cache de exames se necessário
  ↓
Retorna: IRiskData (atualizado)
```

**Passo 5 - Frontend atualiza UI**

```
useMutUpsertRiskData.onSuccess()
  ↓
queryClient.invalidateQueries([QueryEnum.RISK_DATA, ...])
  ↓
React Query refetch automático
  ↓
UI atualizada com novo EPI
```

---

## 7. Estruturas de Dados Importantes

### IRiskData (Resposta do Backend)

```typescript
interface IRiskData {
  id: string;
  riskId: string;
  homogeneousGroupId: string;
  riskFactorGroupDataId: string;
  probability?: number;
  probabilityAfter?: number;

  // Relacionamentos
  recs: IRecMed[]; // Recomendações
  adms: IRecMed[]; // Medidas administrativas
  generateSources: IGenerateSource[]; // Fontes geradoras
  epis: { epiRiskData: IEpiRiskData }[]; // EPIs
  engs: { engsRiskData: IEngsRiskData }[]; // Medidas de engenharia
  exams: { examsRiskData: IExamRiskData }[]; // Exames

  // Outros
  isQuantity?: boolean; // Método quantitativo
  startDate?: Date;
  endDate?: Date;
}
```

### IEpiRiskData

```typescript
interface IEpiRiskData {
  epiId: number; // ID do EPI
  efficientlyCheck?: boolean; // EPI eficaz
  longPeriodsCheck?: boolean; // Longos períodos
  maintenanceCheck?: boolean; // Manutenção
  sanitationCheck?: boolean; // Higienização
  trainingCheck?: boolean; // Treinamento
  unstoppedCheck?: boolean; // Uso ininterrupto
  ca?: string; // CA
  lifespan?: string; // Vida útil
}
```

---

## 8. Permissões

Todas as operações de upsert requerem:

- `PermissionEnum.RISK_DATA` com `crud: 'cu'` (create/update)
- `isContract: true` - Usuário deve ter contrato ativo
- `isMember: true` - Usuário deve ser membro da empresa

Operações de deleção requerem:

- `PermissionEnum.RISK_DATA` com `crud: 'd'` (delete)

---

## 9. Considerações Importantes

### 9.1 Merge vs Replace

- **EPIs, Recomendações, Medidas:** O sistema faz **merge** (adiciona aos existentes)
- **Probabilidade, Exposição:** O sistema faz **replace** (substitui)
- Para **remover** itens, usar `onHandleRemoveSave()`

### 9.2 keepEmpty Flag

- `keepEmpty: true` → Mantém RiskData mesmo se todos os campos estiverem vazios
- `keepEmpty: false` → Remove RiskData se não tiver nenhum dado

### 9.3 Hierarquia vs GSE

- **GSE:** `homogeneousGroupId` direto
- **Hierarquia:** `homogeneousGroupId` + `workspaceId` + `type: HIERARCHY`
  - Sistema cria automaticamente um GSE vinculado à hierarquia

### 9.4 AddOnly Fields

Campos `*AddOnly` permitem criar novos itens on-the-fly:

- Se item já existe → vincula ao RiskData
- Se item não existe → cria e vincula ao RiskData

---

## 10. Resumo do Fluxo

```
┌──────────────────────────────────────────────────────────────────┐
│ 1. Usuário seleciona GSE/Hierarquia (RiskToolV2)                │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│ 2. Sistema busca riscos (useQueryRiskDataByGho)                 │
│    GET /risk-data/:companyId/:riskGroupId/:riskId                │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│ 3. Renderiza lista de riscos (RiskToolGSEView)                  │
│    Cada risco → RiskToolSingleRiskRow                            │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│ 4. Usuário edita dados (EPI, Rec, Probabilidade, etc)           │
│    RiskToolSingleRiskRow → handleSelect()                        │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│ 5. Prepara payload e faz merge com dados existentes             │
│    useColumnAction → onHandleSelectSave()                        │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│ 6. Chama mutation                                                │
│    useMutUpsertRiskData → POST /risk-data                        │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│ 7. Backend processa (UpsertRiskDataService)                     │
│    - Valida permissões                                           │
│    - Cria GSE de hierarquia se necessário                        │
│    - Faz upsert no banco (Prisma)                                │
│    - Processa AddOnly fields                                     │
│    - Atualiza PPP de funcionários                                │
│    - Verifica exames                                             │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│ 8. Frontend recebe resposta e atualiza UI                       │
│    - Invalida queries (React Query)                              │
│    - Refetch automático                                          │
│    - UI refletindo novos dados                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

**Fim da documentação**
