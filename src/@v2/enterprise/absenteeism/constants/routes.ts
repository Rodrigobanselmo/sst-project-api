export const AbsenteeismRoutes = {
  DASHBOARD: {
    HIERARCHY_TIME_COMPARE: 'v2/companies/:companyId/absenteeism/dashboard/hierarchy/time-compare',
    HIERARCHY_TOTAL_BROWSE: 'v2/companies/:companyId/absenteeism/dashboard/hierarchy/total',
    EMPLOYEE_TOTAL_BROWSE: 'v2/companies/:companyId/absenteeism/dashboard/employee/total',
    TIMELINE_TOTAL: 'v2/companies/:companyId/absenteeism/dashboard/timeline/total',
    MOTIVE_COUNT: 'v2/companies/:companyId/absenteeism/dashboard/motive/count',
    DAYS_COUNT: 'v2/companies/:companyId/absenteeism/dashboard/days/count',
  },
} as const;
