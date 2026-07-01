export const SubTypeRoutes = {
  SUB_TYPE: {
    PATH: 'v2/companies/:companyId/workspaces/:workspaceId/risk/sub-types',
    PATH_ID: 'v2/companies/:companyId/risk/sub-types/:id',
  },
  MASTER: {
    BASE: 'v2/master/risk-sub-types',
    BY_ID: 'v2/master/risk-sub-types/:id',
    STATUS: 'v2/master/risk-sub-types/:id/status',
  },
  MASTER_CURATION: {
    BASE: 'v2/master/risk-subtype-curation',
    RISKS: 'risks',
    BULK_ASSIGN: 'risks/bulk-assign',
    BULK_CLEAR: 'risks/bulk-clear',
  },
} as const;

export const RiskFactorRoutes = {
  RISK_FACTOR: {
    AI_SUGGESTIONS: 'v2/risk-factors/ai-suggestions',
  },
} as const;
