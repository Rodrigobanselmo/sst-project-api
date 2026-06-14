export const OccupationalHygieneRoutes = {
  HO_METHOD: {
    BASE: 'v2/ho-methods',
    BY_ID: 'v2/ho-methods/:id',
    UPLOAD: 'v2/companies/:companyId/ho-methods/files',
    RISK_SEARCH: 'v2/ho-methods/risk-factors/search',
  },
  HO_SAMPLER: {
    BASE: 'v2/ho-samplers',
  },
  HO_EXTRACTION_SOLVENT: {
    BASE: 'v2/ho-extraction-solvents',
  },
  HO_LABORATORY: {
    BASE: 'v2/ho-laboratories',
  },
} as const;
