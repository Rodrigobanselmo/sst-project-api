export const CharacterizationRoutes = {
  CHARACTERIZATION: {
    BROWSE: 'v2/companies/:companyId/workspaces/:workspaceId/characterizations',
    EDIT_MANY: 'v2/companies/:companyId/workspaces/:workspaceId/characterizations/many',
  },
  PHOTO_RECOMMENDATION: {
    EDIT_MANY: 'v2/companies/:companyId/photo-recommendations/many',
  },
} as const;
