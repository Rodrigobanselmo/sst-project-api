export const StatusRoutes = {
  STATUS: {
    ADD: 'v2/companies/:companyId/status',
    BROWSE: 'v2/companies/:companyId/status',
    EDIT: 'v2/companies/:companyId/status/:id',
    DELETE: 'v2/companies/:companyId/status/:id',
  },
} as const;
