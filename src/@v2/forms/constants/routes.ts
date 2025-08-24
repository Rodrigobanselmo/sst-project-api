export const FormRoutes = {
  FORM: {
    PATH: 'v2/companies/:companyId/forms/models/',
    PATH_ID: 'v2/companies/:companyId/forms/models/:formId',
  },
  FORM_APPLICATION: {
    PATH: 'v2/companies/:companyId/forms/applications/',
    PATH_ID: 'v2/companies/:companyId/forms/applications/:applicationId',
    PATH_PUBLIC: 'v2/forms/applications/:applicationId/public',
  },
  FORM_QUESTIONS_ANSWERS: {
    PATH: 'v2/companies/:companyId/forms/questions-answers/',
  },
  RISK: {
    PATH: 'v2/companies/:companyId/forms/risks/',
  },
  HIERARCHY: {
    PATH: 'v2/companies/:companyId/forms/hierarchies/',
  },
} as const;
