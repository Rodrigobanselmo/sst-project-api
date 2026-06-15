export const SubTypeRoutes = {
  SUB_TYPE: {
    PATH: 'v2/companies/:companyId/workspaces/:workspaceId/risk/sub-types',
    PATH_ID: 'v2/companies/:companyId/risk/sub-types/:id',
  },
} as const;

export const RiskFactorRoutes = {
  RISK_FACTOR: {
    AI_SUGGESTIONS: 'v2/risk-factors/ai-suggestions',
  },
} as const;
