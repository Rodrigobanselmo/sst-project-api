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
} as const;
