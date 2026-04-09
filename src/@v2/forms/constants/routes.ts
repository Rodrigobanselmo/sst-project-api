export const FormRoutes = {
  FORM: {
    PATH: 'v2/companies/:companyId/forms/models/',
    PATH_ID: 'v2/companies/:companyId/forms/models/:formId',
    /** Path completo para @Controller() + @Post (sem prefixo no controller). */
    PATH_ID_DUPLICATE: 'v2/companies/:companyId/forms/models/:formId/duplicate',
  },
  FORM_APPLICATION: {
    PATH: 'v2/companies/:companyId/forms/applications/',
    PATH_ID: 'v2/companies/:companyId/forms/applications/:applicationId',
    PATH_ASSIGN_RISKS: 'v2/companies/:companyId/forms/applications/:applicationId/assign-risks',
    PATH_RISK_LOGS: 'v2/companies/:companyId/forms/applications/:applicationId/risk-logs',
    PATH_PUBLIC: 'v2/forms/applications/:applicationId/public',
    PATH_PUBLIC_LOGIN: 'v2/forms/applications/:applicationId/public/login',
  },
  FORM_QUESTIONS_ANSWERS: {
    PATH: 'v2/companies/:companyId/forms/questions-answers/',
    PATH_RISKS: 'v2/companies/:companyId/forms/applications/:applicationId/questions-answers/risks/',
    AI_ANALYZE_RISKS: 'v2/companies/:companyId/forms/applications/:applicationId/questions-answers/ai-analyze-risks',
    BROWSE_ANALYSIS: 'v2/companies/:companyId/forms/applications/:applicationId/questions-answers-analysis',
    EDIT_ANALYSIS: 'v2/companies/:companyId/forms/applications/:applicationId/questions-answers-analysis/:analysisId',
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
  /** Biblioteca de Perguntas Preliminares (templates; cópia na aplicação na fase seguinte). */
  FORM_PRELIMINARY_LIBRARY: {
    QUESTIONS: 'v2/companies/:companyId/forms/preliminary-library/questions',
    BLOCKS: 'v2/companies/:companyId/forms/preliminary-library/blocks',
  },
} as const;
