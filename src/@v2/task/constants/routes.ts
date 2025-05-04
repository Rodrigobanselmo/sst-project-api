export const TaskRoutes = {
  TASK: {
    ADD: 'v2/companies/:companyId/task',
    BROWSE: 'v2/companies/:companyId/task',
    EDIT: 'v2/companies/:companyId/task/:id',
    DELETE: 'v2/companies/:companyId/task/:id',
    READ: 'v2/companies/:companyId/task/:id',
  },
  TASK_PROJECT: {
    ADD: 'v2/companies/:companyId/task-project',
    BROWSE: 'v2/companies/:companyId/task-project',
    EDIT: 'v2/companies/:companyId/task-project/:id',
    DELETE: 'v2/companies/:companyId/task-project/:id',
    READ: 'v2/companies/:companyId/task-project/:id',
  },
} as const;
