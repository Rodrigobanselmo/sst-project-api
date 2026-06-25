export const MedicineRoutes = {
  BIOLOGICAL_INDICATORS: {
    BASE: 'v2/master/biological-indicators',
    EXAM_CANDIDATES: 'exam-candidates',
    APPLICATION_PREVIEW: 'application-preview',
    APPLY: 'apply',
    EXPORT: 'export',
    TEMPLATE: 'template',
    IMPORT_PREVIEW: 'import/preview',
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
} as const;
