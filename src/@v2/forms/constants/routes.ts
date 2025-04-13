export const FormRoutes = {
  FORM: {
    PATH: 'v2/companies/:companyId/forms/',
    PATH_ID: 'v2/companies/:companyId/forms/:formId',
  },
  FORM_APPLICATION: {
    PATH: 'v2/companies/:companyId/forms/applications/',
    PATH_ID: 'v2/companies/:companyId/forms/applications/:applicationId',
  },
} as const;
