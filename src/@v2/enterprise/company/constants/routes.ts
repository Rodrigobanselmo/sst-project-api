export const CompanyRoutes = {
  WORKSPACE: {
    BROWSE_ALL: 'v2/companies/:companyId/workspaces/all',
    DELETE: 'v2/companies/:companyId/workspaces/:workspaceId',
  },
  VISUAL_IDENTITY: {
    READ: 'v2/companies/:companyId/visual-identity',
  },
} as const

