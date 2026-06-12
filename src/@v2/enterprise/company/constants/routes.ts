export const CompanyRoutes = {
  COMPANY_GROUP: {
    HOME_SUMMARY: 'v2/company-groups/:companyGroupId/home-summary',
  },
  REPAIR_HYBRID_FORM_APPLICATIONS:
    'v2/companies/:companyId/repair-hybrid-form-applications',
  WORKSPACE: {
    BROWSE_ALL: 'v2/companies/:companyId/workspaces/all',
    DELETE: 'v2/companies/:companyId/workspaces/:workspaceId',
    CONVERT_TO_COMPANY: {
      BASE: 'v2/companies/:companyId/workspaces/:workspaceId/convert-to-company',
      COMPANY_GROUPS:
        'v2/companies/:companyId/workspaces/:workspaceId/convert-to-company/company-groups',
      PREVIEW:
        'v2/companies/:companyId/workspaces/:workspaceId/convert-to-company/preview',
      CONVERT:
        'v2/companies/:companyId/workspaces/:workspaceId/convert-to-company',
    },
  },
  VISUAL_IDENTITY: {
    READ: 'v2/companies/:companyId/visual-identity',
  },
} as const

