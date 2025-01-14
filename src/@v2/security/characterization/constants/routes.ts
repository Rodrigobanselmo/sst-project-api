export const SecurityRoutes = {
  CHARACTERIZATION: {
    BROWSE: 'v2/companies/:companyId/workspaces/:workspaceId/characterizations',
    EDIT_MANY: 'v2/companies/:companyId/workspaces/:workspaceId/characterizations/many',
  },
} as const;
