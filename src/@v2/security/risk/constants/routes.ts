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
} as const;

export const RiskFactorRoutes = {
  RISK_FACTOR: {
    AI_SUGGESTIONS: 'v2/risk-factors/ai-suggestions',
  },
} as const;
