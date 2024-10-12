export const SecurityRoutes = {
  CHARACTERIZATION: {
    BROWSE: 'v2/companies/:companyId/workspaces/:workspaceId/characterizations',
  },
  STATUS: {
    ADD: 'v2/companies/:companyId/status',
    BROWSE: 'v2/companies/:companyId/status',
    EDIT: 'v2/companies/:companyId/status/:id',
    DELETE: 'v2/companies/:companyId/status/:id',
  }
} as const

