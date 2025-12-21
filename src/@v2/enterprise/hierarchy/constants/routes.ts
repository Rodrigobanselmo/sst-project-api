export const HierarchyRoutes = {
  HIERARCHY: {
    LIST_TYPES: 'v2/companies/:companyId/hierarchy/list-types',
    BROWSE_SHORT: 'v2/companies/:companyId/action-plans/hierarchies/short',
    BROWSE: 'v2/companies/:companyId/action-plans/hierarchies',
    PATH_ID: 'v2/companies/:companyId/hierarchy/:hierarchyId',
  },
} as const;
