export const RISK_SUBTYPE_CURATION_SUGGEST_MODEL =
  process.env.RISK_SUBTYPE_CURATION_SUGGEST_MODEL ||
  process.env.OPENAI_MODEL ||
  'gpt-4o-mini';

export const RISK_SUBTYPE_CURATION_SUGGEST_CHUNK_SIZE = 25;
export const RISK_SUBTYPE_CURATION_SUGGEST_DEFAULT_MAX = 100;
export const RISK_SUBTYPE_CURATION_SUGGEST_ABSOLUTE_MAX = 150;
export const RISK_SUBTYPE_CURATION_SUGGEST_CHUNK_TIMEOUT_MS = 45_000;

export const RISK_SUBTYPE_CURATION_SUGGEST_CHUNK_RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          riskFactorId: { type: 'string' },
          suggestedInclude: { type: 'boolean' },
          confidence: { type: 'string', enum: ['low', 'medium', 'high'] },
          rationale: { type: 'string' },
          warnings: {
            type: 'array',
            items: { type: 'string' },
          },
        },
        required: [
          'riskFactorId',
          'suggestedInclude',
          'confidence',
          'rationale',
          'warnings',
        ],
        additionalProperties: false,
      },
    },
  },
  required: ['items'],
  additionalProperties: false,
} as const;
