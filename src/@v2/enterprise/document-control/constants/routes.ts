export const DocumentControlRoutes = {
  DOCUMENT_CONTROL: {
    PATH: 'v2/companies/:companyId/workspaces/:workspaceId/document-control',
    PATH_ID: 'v2/companies/:companyId/document-control/:documentControlId',
  },
  DOCUMENT_CONTROL_FILE: {
    PATH: 'v2/companies/:companyId/document-control/:documentControlId/document-control-files',
    PATH_ID: 'v2/companies/:companyId/document-control/document-control-files/:documentControlFileId',
  },
  FILE: {
    PATH: 'v2/companies/:companyId/document-control/files',
  },
} as const;
