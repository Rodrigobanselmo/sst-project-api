export const TaskRoutes = {
  TASK: {
    ADD: 'v2/companies/:companyId/task',
    BROWSE: 'v2/companies/:companyId/task',
    EDIT: 'v2/companies/:companyId/task/:id',
    DELETE: 'v2/companies/:companyId/task/:id',
  },
} as const;
