export const MedicineRoutes = {
  BIOLOGICAL_INDICATORS: {
    BASE: 'v2/master/biological-indicators',
    EXAM_CANDIDATES: 'exam-candidates',
    APPLICATION_PREVIEW: 'application-preview',
    APPLY: 'apply',
    EXPORT: 'export',
    TEMPLATE: 'template',
    IMPORT_PREVIEW: 'import/preview',
    IMPORT_APPLY: 'import/apply',
    // 4P.1B — preview/dry-run (somente leitura) de candidatos ACGIH/BEI a
    // indicador oficial. Não cria dados.
    ACGIH_PROMOTION_PREVIEW: 'acgih-promotion/preview',
    // 4P.2A — promoção real (escrita) de candidatos ACGIH/BEI elegíveis para
    // OccupationalBiologicalIndicator DRAFT. MASTER-only.
    ACGIH_PROMOTION_APPLY: 'acgih-promotion/apply',
    // Frente A.1 — preview/dry-run (somente leitura) da correlação ACGIH/BEI ×
    // Fatores de Risco, com overrides manuais versionados. Não cria dados.
    ACGIH_RISK_CORRELATION_PREVIEW: 'acgih-risk-correlation/preview',
    // Frente A.3 — apply seguro (escrita controlada) da correlação ACGIH/BEI ×
    // Fatores de Risco. Cria APENAS BiologicalIndicatorToRisk. MASTER-only.
    ACGIH_RISK_CORRELATION_APPLY: 'acgih-risk-correlation/apply',
    // Fix — consolidação completa: promove TODOS os ACGIH/BEI da correlação (os
    // 65) a OccupationalBiologicalIndicator, sem o recorte por tier da 4P.2.
    // Cria APENAS OccupationalBiologicalIndicator. MASTER-only.
    ACGIH_RISK_CORRELATION_CONSOLIDATE:
      'acgih-risk-correlation/consolidate-official-indicators',
    // Vínculo ACGIH/BEI → Exame: cria APENAS BiologicalIndicatorToExam para os
    // indicadores oficiais ACGIH/BEI (pré-requisito do sync da Biblioteca).
    // MASTER-only. Não cria exame, regra da Biblioteca nem ExamToRisk.
    ACGIH_EXAM_LINK_SYNC: 'acgih-exam-links/sync',
    // Estado consolidado (read-only) de exame por indicador ACGIH/BEI.
    ACGIH_EXAM_LINK_PREVIEW: 'acgih-exam-links/preview',
    // Resolução em lote: vincula candidatos seguros e cria exame quando faltar.
    ACGIH_EXAM_LINK_RESOLVE: 'acgih-exam-links/resolve',
    ACGIH_EXAM_LINK_CONFIRM_SAFE_PENDING: 'acgih-exam-links/confirm-safe-pending',
    RISK_LINKS: {
      CONFIRM: 'risk-links/:id/confirm',
      REJECT: 'risk-links/:id/reject',
      PRIMARY: 'risk-links/:id/primary',
    },
    EXAM_LINKS: {
      CONFIRM: 'exam-links/:id/confirm',
      REJECT: 'exam-links/:id/reject',
      DEFAULT: 'exam-links/:id/default',
    },
    BY_ID: {
      PATH: ':id',
      STATUS: ':id/status',
      REVIEW_NOTES: ':id/review-notes',
      REMATCH: ':id/rematch',
      RISK_LINKS: ':id/risk-links',
      EXAM_LINKS: ':id/exam-links',
      PENDENCIES: ':id/pendencies',
    },
  },
  EXAM_RISK_RULES: {
    BASE: 'v2/master/exam-risk-rules',
    RISK_CANDIDATES: 'risk-candidates',
    EXAM_CANDIDATES: 'exam-candidates',
    SYNC_NR07: 'sync-nr07',
    // Sincronização ACGIH/BEI consolidados → Biblioteca Risco × Exame (regras
    // TECHNICAL e referências complementares em NR-07). MASTER-only.
    SYNC_ACGIH_BEI: 'sync-acgih-bei',
    EXPORT: 'export',
    TEMPLATE: 'template',
    IMPORT_PREVIEW: 'import/preview',
    IMPORT_APPLY: 'import/apply',
    REFERENCES: ':ruleId/references',
    REFERENCE_BY_ID: ':ruleId/references/:referenceId',
    BY_ID: {
      PATH: ':id',
      STATUS: ':id/status',
    },
  },
  ESOCIAL_PROCEDURES: {
    BASE: 'v2/master/esocial-procedures',
    EXPORT: 'export',
    TEMPLATE: 'template',
    IMPORT_PREVIEW: 'import/preview',
    IMPORT_APPLY: 'import/apply',
    BY_CODE: ':procedureCode',
    BY_ID: {
      PATH: ':id',
      STATUS: ':id/status',
    },
  },
  ACGIH_BEI_INDICATORS: {
    BASE: 'v2/master/acgih-bei-indicators',
    EXPORT: 'export',
    TEMPLATE: 'template',
    IMPORT_PREVIEW: 'import/preview',
    IMPORT_APPLY: 'import/apply',
    BY_ID: {
      PATH: ':id',
      STATUS: ':id/status',
    },
  },
  EXAMS: {
    ESOCIAL_T27: {
      BASE: 'v2/exams/esocial-t27',
      SEARCH: 'search',
      MATERIALIZE: 'materialize',
    },
  },
  ACGIH_BEI_COMPARISON: {
    BASE: 'v2/master/acgih-bei-comparison',
    EXPORT: 'export',
    REFERENCES: 'references',
    REVIEWS: 'reviews',
    REVIEW_BY_ID: 'reviews/:acgihBeiIndicatorId',
    REVIEW_AI_SUGGESTION: 'reviews/:acgihBeiIndicatorId/ai-suggestion',
  },
} as const;
