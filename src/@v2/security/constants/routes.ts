export const SecurityRoutes = {
  CHARACTERIZATION: {
    BROWSE: 'v2/companies/:companyId/workspaces/:workspaceId/characterizations',
  },
  ACTION_PLAN: {
    BROWSE: 'v2/companies/:companyId/action-plan',
  },
  STATUS: {
    ADD: 'v2/companies/:companyId/status',
    BROWSE: 'v2/companies/:companyId/status',
    EDIT: 'v2/companies/:companyId/status/:id',
    DELETE: 'v2/companies/:companyId/status/:id',
  }
} as const

