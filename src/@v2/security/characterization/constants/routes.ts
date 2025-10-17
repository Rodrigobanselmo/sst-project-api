export const CharacterizationRoutes = {
  CHARACTERIZATION: {
    BROWSE: 'v2/companies/:companyId/workspaces/:workspaceId/characterizations',
    EDIT_MANY: 'v2/companies/:companyId/workspaces/:workspaceId/characterizations/many',
    AI_ANALYZE: 'v2/companies/:companyId/workspaces/:workspaceId/characterizations/:characterizationId/ai-analyze',
  },
  PHOTO_RECOMMENDATION: {
    EDIT_MANY: 'v2/companies/:companyId/photo-recommendations/many',
  },
} as const;
