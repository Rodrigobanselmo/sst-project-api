export const AuthRoutes = {
  USER: {
    BROWSE: 'v2/companies/:companyId/users',
    ADD: 'v2/companies/:companyId/users',
  },
  SESSION: {
    SIGN_IN: 'v2/sessions/signin',
  },
} as const;
