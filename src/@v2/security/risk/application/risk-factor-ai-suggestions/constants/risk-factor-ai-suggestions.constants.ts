export const RISK_FACTOR_AI_SUGGESTIONS_RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    risk: { type: 'string' },
    symptoms: { type: 'string' },
    severity: { type: 'integer', minimum: 1, maximum: 5 },
    confidence: { type: 'string', enum: ['low', 'medium', 'high'] },
    sourceTrace: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          usedFor: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['risk', 'symptoms', 'severity', 'organs'],
            },
          },
          note: { type: ['string', 'null'] },
        },
        required: ['source', 'usedFor', 'note'],
        additionalProperties: false,
      },
    },
    warnings: {
      type: 'array',
      items: { type: 'string' },
    },
  },
  required: ['risk', 'symptoms', 'severity', 'confidence', 'sourceTrace', 'warnings'],
  additionalProperties: false,
} as const;

export const RISK_FACTOR_AI_SUGGESTIONS_MODEL =
  process.env.RISK_FACTOR_AI_SUGGESTIONS_MODEL || 'gpt-4o-mini';
