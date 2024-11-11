export const SecurityRoutes = {
  ACTION_PLAN: {
    BROWSE: 'v2/companies/:companyId/action-plans',
    EDIT: 'v2/companies/:companyId/action-plans',
    EDIT_MANY: 'v2/companies/:companyId/action-plans/many',
  },
  COMMENT: {
    EDIT_MANY: 'v2/companies/:companyId/action-plans/comments/many',
  }
} as const

