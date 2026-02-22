# Padrão do Módulo de Insalubridade — SimpleSST

## 📋 Visão Geral

O módulo de insalubridade gera o **Laudo de Insalubridade** com base nos 14 Anexos da NR-15. Cada anexo pode ter critério **quantitativo** ou **qualitativo**.

---

## 🏗️ Estrutura do Documento

### Hierarquia de Títulos

```
H1 → Título do Anexo (ex: "Ruído Contínuo ou Intermitente")
  │   └── Texto introdutório (descriptionWithGroups ou descriptionWithoutGroups)
  │
  H2 → Tipo de Grupo (Caracterização / Hierarquia / GHO)
  │   └── Contém múltiplos H3
  │
  H3 → Nome da Caracterização/Cargo/GHO
      ├── Tabela de Hierarquia (se aplicável)
      ├── Fatores de Risco
      ├── Atividades Reais
      ├── Atividades Normativas
      └── Conclusão Individual
```

---

## 📊 Tipos de Grupos

| Tipo | Descrição | Filtro no Código |
|------|-----------|------------------|
| **Caracterização** | Grupos com caracterização física (ambiente) | `group.characterization` |
| **Hierarquia** | Grupos por cargo/posição | `group.isHierarchy` |
| **GHO** | Grupo Homogêneo de Exposição | `group.isGHO` |

---

## 📝 Configuração dos Anexos (insalubridadeConfig)

Cada anexo deve conter:

```typescript
{
  title: string;           // Nome do Anexo
  anexo: string;           // "Anexo X da NR-15"
  criterio: 'quantitativo' | 'qualitativo';
  descriptionWithGroups: string;     // Texto H1 quando há grupos
  descriptionWithoutGroups: string;  // Texto H1 quando não há grupos
}
```

---

## 🔢 Anexos Quantitativos (5)

| Anexo | Fator de Risco | Enum | Grau Padrão |
|-------|----------------|------|-------------|
| 1 | Ruído Contínuo ou Intermitente | RUIDO_CONTINUO_1 | Médio 20% |
| 2 | Ruído de Impacto | RUIDO_IMPACTO_2 | Médio 20% |
| 3 | Calor | CALOR_3 | Médio 20% |
| 8 | Vibrações | VIBRACAO_8 | Variável |
| 11 | Agentes Químicos (LT) | AGENTES_QUIMICOS_11 | Variável |
| 12 | Poeiras Minerais | POEIRAS_MINERAIS_12 | Variável |

### Lógica de Conclusão Quantitativa

```typescript
// Padrão para verificar se está acima do limite
const riskDataAboveLimit = riskData.filter((rd) => {
  return rd.quantityXXX.probability >= 5; // >= 5 = acima do limite
});
```

### Cenários de Conclusão Quantitativa

1. **Inconclusivo**: Sem medições quantitativas
2. **Neutralizado**: Valor > LT + EPI eficaz (`efficientlyCheck = true`)
3. **Insalubre**: Valor > LT + EPI não eficaz
4. **Não Insalubre**: Valor ≤ LT

---

## 📋 Anexos Qualitativos (9)

| Anexo | Fator de Risco | Enum | Grau |
|-------|----------------|------|------|
| 5 | Radiações Ionizantes | RADIACAO_IONIZANTE_5 | Máximo 40% |
| 6 | Pressões Hiperbáricas | PRESSAO_HIPERBARICA_6 | Máximo 40% |
| 7 | Radiações Não Ionizantes | RADIACAO_NAO_IONIZANTE_7 | Médio 20% |
| 9 | Frio | FRIO_9 | Médio 20% |
| 10 | Umidade | UMIDADE_10 | Médio 20% |
| 13 | Agentes Químicos (Qualitativo) | AGENTES_QUIMICOS_QUALITATIVO_13 | Variável |
| 13-A | Benzeno | BENZENO_13A | Máximo 40% |
| 14 | Agentes Biológicos | AGENTES_BIOLOGICOS_14 | Variável |

### Cenários de Conclusão Qualitativa

1. **Não Insalubre**: Atividade não equivalente ou não habitual/permanente
2. **Insalubre**: Atividade equivalente + habitual/permanente
3. **Neutralizado**: Atividade equivalente + EPI eficaz

---

## 🔧 Funções Helper Obrigatórias

### Para cada tipo de risco quantitativo, criar:

```typescript
// 1. Obter valor medido
const getMeasuredXXXValue = (quantityXXX: RiskDataQuantityXXXVO): { ... } | null

// 2. Obter limite de tolerância
const getXXXToleranceLimit = (): string

// 3. Função principal de conclusão
const getXXXInsalubridadeConclusion = ({ group, hierarchyTree }): {
  conclusion: ISectionChildrenType[];
  hasInsalubridade: boolean;
}
```

---

## ⚠️ Regras Importantes

### Terminologia
- ✅ Usar **"GRO"** (Gerenciamento de Riscos Ocupacionais)
- ❌ Não usar "sistema"
- ✅ Usar **"cargos"** nas conclusões
- ❌ Não usar "cargo(s), atividade(s) ou grupo(s) homogêneo(s)"

### Grau de Insalubridade
- **MIN**: 10% (grau mínimo)
- **MED**: 20% (grau médio)
- **MAX**: 40% (grau máximo)
- Buscar do banco via `risk.grauInsalubridade`

### EPI Eficaz
- Verificar `epi.efficientlyCheck === true`
- Se EPI eficaz + acima do limite = **Neutralizado** (não insalubre)

### Estrutura da Conclusão
- Sempre começar com `H3: Conclusão — {nomeCaracterização}`
- Sempre incluir o grau de insalubridade no texto
- Sempre mencionar o Anexo específico da NR-15
- Sempre restringir a conclusão aos cargos vinculados

---

## 📁 Arquivos Relacionados

```
activities-insalubridade/
├── activities-insalubridade.sections.ts  # Lógica principal
├── PADRAO_INSALUBRIDADE.md               # Este arquivo
└── (outros arquivos de suporte)
```

### Value Objects para Dados Quantitativos
- `RiskDataQuantityNoiseVO` - Ruído (nr15q5, ltcatq5, ltcatq3)
- `RiskDataQuantityHeatVO` - Calor (ibtug, mw, ibtugLEO)
- `RiskDataQuantityVibrationVO` - Vibração (a implementar)
- `RiskDataQuantityChemicalVO` - Químicos (a implementar)

---

## ✅ Checklist para Novo Anexo

- [ ] Adicionar enum em `RiskInsalubridadeEnum`
- [ ] Adicionar config em `insalubridadeConfig`
- [ ] Adicionar na ordem em `insalubridadeOrder`
- [ ] Criar Value Object (se quantitativo)
- [ ] Criar função `getXXXInsalubridadeConclusion()`
- [ ] Adicionar case no switch de `getInsalubridadeConclusion()`
- [ ] Testar todos os cenários de conclusão

---

## 📝 Exemplo Completo: Implementação de Calor (Anexo 3)

### 1. Config do Anexo

```typescript
[RiskInsalubridadeEnum.CALOR_3]: {
  title: 'Calor',
  anexo: 'Anexo 3 da NR-15',
  criterio: 'quantitativo',
  descriptionWithGroups: 'Neste item do Laudo de Insalubridade são apresentados...',
  descriptionWithoutGroups: 'Não foram identificadas, neste item, atividades...',
},
```

### 2. Helper para Valor Medido

```typescript
const getMeasuredHeatValue = (quantityHeat: RiskDataQuantityHeatVO): {
  ibutg: string;
  limit: string;
} | null => {
  if (quantityHeat.ibtug && quantityHeat.ibtugLEO) {
    return {
      ibutg: quantityHeat.ibtug.toFixed(1),
      limit: quantityHeat.ibtugLEO.ibtug.toFixed(1),
    };
  }
  return null;
};
```

### 3. Função de Conclusão

```typescript
const getHeatInsalubridadeConclusion = ({
  group,
  hierarchyTree,
}: {
  group: HomogeneousGroupModel;
  hierarchyTree: IHierarchyMap;
}): { conclusion: ISectionChildrenType[]; hasInsalubridade: boolean } => {

  // 1. Filtrar risk data pelo tipo
  const heatRiskData = group.allRiskData.filter(
    (rd) => rd.risk.insalubridade === RiskInsalubridadeEnum.CALOR_3
  );

  // 2. Obter nome da caracterização
  const characterizationName = getCharacterizationNameForConclusion(group, hierarchyTree);

  // 3. Obter grau de insalubridade
  const grauFromRisk = heatRiskData[0]?.risk?.grauInsalubridade ?? null;
  const grauInsalubridade = getGrauInsalubridadeLabel(grauFromRisk);

  // 4. Verificar dados quantitativos
  const hasQuantitativeData = heatRiskData.some(
    (rd) => rd.isQuantity && rd.quantityHeat
  );

  // 5. Analisar se acima/abaixo do limite
  const riskDataAboveLimit = heatRiskData.filter((rd) => {
    if (!rd.quantityHeat) return false;
    return rd.quantityHeat.probability >= 5; // >= 5 = IBUTG > LEO
  });

  // 6. Verificar EPI eficaz
  const hasEfficientEPI = riskDataAboveLimit.some((rd) => {
    return rd.epis.some((epi) => epi.efficientlyCheck);
  });

  // 7. Retornar conclusão apropriada
  // ... (ver cenários acima)
};
```

### 4. Adicionar no Switch

```typescript
switch (insalubridadeType) {
  case RiskInsalubridadeEnum.RUIDO_CONTINUO_1:
  case RiskInsalubridadeEnum.RUIDO_IMPACTO_2:
    return getNoiseInsalubridadeConclusion({ group, insalubridadeType, hierarchyTree });
  case RiskInsalubridadeEnum.CALOR_3:
    return getHeatInsalubridadeConclusion({ group, hierarchyTree });
  // TODO: Adicionar outros tipos...
  default:
    return { conclusion: [], hasInsalubridade: false };
}
```

---

## 📌 Textos Padrão por Cenário

### Inconclusivo (Sem Medições)

> Não é possível concluir quanto à caracterização da insalubridade para esta caracterização específica, uma vez que o critério de avaliação aplicável é quantitativo e não há medições de [TIPO] registradas no GRO, condição indispensável para a análise conforme o [ANEXO] da NR-15.

### Neutralizado (EPI Eficaz)

> Para a presente caracterização específica, vinculada aos cargos analisados, verifica-se que [VALOR MEDIDO] excede o [LIMITE], conforme critérios estabelecidos no [ANEXO] da NR-15, caracterizando, em princípio, condição insalubre em [GRAU].
>
> Entretanto, ficou comprovado no GRO que foram adotadas, previamente, medidas de proteção coletiva e administrativa, e que os Equipamentos de Proteção Individual fornecidos são tecnicamente adequados ao agente...
>
> Dessa forma, nos termos do item 15.4 da NR-15, resta caracterizada a neutralização da insalubridade...

### Insalubre

> Com base nos resultados das avaliações quantitativas de [TIPO] registradas no GRO para esta caracterização, verifica-se que [VALOR MEDIDO] ultrapassa [LIMITE] estabelecido no [ANEXO] da NR-15...
>
> Conclui-se, portanto, pela caracterização da insalubridade para os cargos vinculados a esta caracterização, em decorrência da exposição ocupacional ao [TIPO] acima do limite de tolerância. O grau de insalubridade aplicável é [GRAU]...

### Não Insalubre

> Com base nos resultados das avaliações quantitativas de [TIPO] associadas à caracterização analisada, verifica-se que [VALOR MEDIDO] permaneceu abaixo de [LIMITE] previsto no [ANEXO] da NR-15...
>
> Conclui-se, portanto, pela não caracterização da insalubridade para os cargos vinculados a esta caracterização.

---

## 🔄 Fluxo de Decisão

```
┌─────────────────────────────────────────────┐
│        Tem dados quantitativos?             │
└─────────────────┬───────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │ NÃO               │ SIM
        ▼                   ▼
   ┌─────────┐    ┌───────────────────┐
   │INCONCLU-│    │ Valor > Limite?   │
   │  SIVO   │    └────────┬──────────┘
   └─────────┘             │
                 ┌─────────┴─────────┐
                 │ NÃO               │ SIM
                 ▼                   ▼
            ┌─────────┐    ┌───────────────────┐
            │   NÃO   │    │  EPI Eficaz?      │
            │INSALUBRE│    └────────┬──────────┘
            └─────────┘             │
                          ┌─────────┴─────────┐
                          │ SIM               │ NÃO
                          ▼                   ▼
                    ┌───────────┐      ┌───────────┐
                    │NEUTRALIZA-│      │ INSALUBRE │
                    │    DO     │      │           │
                    └───────────┘      └───────────┘
```

---

## 📚 Referências

- **NR-15**: Norma Regulamentadora 15 - Atividades e Operações Insalubres
- **GRO**: Gerenciamento de Riscos Ocupacionais
- **IBUTG**: Índice de Bulbo Úmido Termômetro de Globo
- **LEO**: Limite de Exposição Ocupacional
- **NPS**: Nível de Pressão Sonora
- **LT**: Limite de Tolerância

