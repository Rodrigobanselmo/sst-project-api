export const ActionPlanRoutes = {
  ACTION_PLAN_INFO: {
    EDIT: 'v2/companies/:companyId/workspaces/:workspaceId/action-plan-info',
    GET: 'v2/companies/:companyId/workspaces/:workspaceId/action-plan-info',
  },
  ACTION_PLAN: {
    BROWSE: 'v2/companies/:companyId/action-plans',
    EDIT: 'v2/companies/:companyId/action-plans',
    EDIT_MANY: 'v2/companies/:companyId/action-plans/many',
    PHOTO: {
      ADD: 'v2/companies/:companyId/action-plans/photo',
      EDIT: 'v2/companies/:companyId/action-plans/photo/:photoId',
      DELETE: 'v2/companies/:companyId/action-plans/photo/:photoId',
    },
  },
  COMMENT: {
    BROWSE: 'v2/companies/:companyId/action-plans/comments',
    EDIT_MANY: 'v2/companies/:companyId/action-plans/comments/many',
    CREATOR: {
      BROWSE: 'v2/companies/:companyId/action-plans/comments/creators',
    },
  },
  RESPONSIBLE: {
    BROWSE: 'v2/companies/:companyId/action-plans/responsibles',
  },
  COORDINATOR: {
    BROWSE: 'v2/companies/:companyId/action-plans/coordinators',
  },
  HIERARCHY: {
    BROWSE: 'v2/companies/:companyId/action-plans/hierarchies',
  },
  ORIGIN: {
    GET: 'v2/companies/:companyId/workspaces/:workspaceId/origin/:id/recommendation/:recommendationId',
  },
} as const;
