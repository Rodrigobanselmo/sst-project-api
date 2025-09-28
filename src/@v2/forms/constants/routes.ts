export const FormRoutes = {
  FORM: {
    PATH: 'v2/companies/:companyId/forms/models/',
    PATH_ID: 'v2/companies/:companyId/forms/models/:formId',
  },
  FORM_APPLICATION: {
    PATH: 'v2/companies/:companyId/forms/applications/',
    PATH_ID: 'v2/companies/:companyId/forms/applications/:applicationId',
    PATH_ASSIGN_RISKS: 'v2/companies/:companyId/forms/applications/:applicationId/assign-risks',
    PATH_RISK_LOGS: 'v2/companies/:companyId/forms/applications/:applicationId/risk-logs',
    PATH_PUBLIC: 'v2/forms/applications/:applicationId/public',
  },
  FORM_QUESTIONS_ANSWERS: {
    PATH: 'v2/companies/:companyId/forms/questions-answers/',
    PATH_RISKS: 'v2/companies/:companyId/forms/applications/:applicationId/questions-answers/risks/',
  },
  RISK: {
    PATH: 'v2/companies/:companyId/forms/risks/',
  },
  HIERARCHY: {
    PATH: 'v2/companies/:companyId/forms/hierarchies/',
  },
  FORM_PARTICIPANTS: {
    PATH: 'v2/companies/:companyId/forms/applications/:applicationId/participants/',
    SEND_EMAIL: 'v2/companies/:companyId/forms/applications/:applicationId/participants/send-email',
  },
} as const;
