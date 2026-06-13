export const CompanyRoutes = {
  COMPANY_GROUP: {
    HOME_SUMMARY: 'v2/company-groups/:companyGroupId/home-summary',
    CONSOLIDATED_VIEW_ELIGIBILITY:
      'v2/company-groups/:companyGroupId/forms/applications/consolidated-view/eligibility',
    CONSOLIDATED_VIEW_SUMMARY:
      'v2/company-groups/:companyGroupId/forms/applications/consolidated-view/summary',
    CONSOLIDATED_VIEW_PARTICIPANTS:
      'v2/company-groups/:companyGroupId/forms/applications/consolidated-view/participants',
    CONSOLIDATED_VIEW_QUESTIONS_ANSWERS:
      'v2/company-groups/:companyGroupId/forms/applications/consolidated-view/questions-answers',
    CONSOLIDATED_VIEW_INDICATORS_NARRATIVE_DIAGNOSTIC:
      'v2/company-groups/:companyGroupId/forms/applications/consolidated-view/indicators-narrative-diagnostic',
    CONSOLIDATED_VIEW_RISK_ANALYSIS:
      'v2/company-groups/:companyGroupId/forms/applications/consolidated-view/risk-analysis',
    CONSOLIDATED_VIEW_RISK_NARRATIVE_DIAGNOSTIC:
      'v2/company-groups/:companyGroupId/forms/applications/consolidated-view/risk-narrative-diagnostic',
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

