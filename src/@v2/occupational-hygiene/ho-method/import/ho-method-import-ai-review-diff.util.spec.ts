import { describe, expect, it } from '@jest/globals';

import {
  buildHoMethodParserAiComparison,
  isInvalidHoMethodAiAgentName,
} from './ho-method-import-ai-review-diff.util';
import { HoMethodImportParseResult } from './ho-method-import.types';
import { HoMethodAiReviewResult } from './ho-method-import-ai-review.types';

const baseParserResult = (): HoMethodImportParseResult => ({
  detectedFormat: 'NIOSH',
  isSupportedMethod: true,
  warnings: [],
  possibleDuplicate: { exists: false, message: null, existingMethodId: null },
  fields: {
    institution: { value: 'NIOSH', confidence: 'high' },
    methodCode: { value: '2027', confidence: 'high' },
    methodVersion: { value: null, confidence: 'low' },
    issueDate: { value: null, confidence: 'low' },
    evaluation: { value: null, confidence: 'low' },
    displayName: { value: 'Ketones', confidence: 'high' },
    analyticalMethod: { value: 'GC', confidence: 'medium' },
    sampler: { value: 'OVS-7', confidence: 'high' },
    minimumFlowRate: { value: 0.05, confidence: 'high' },
    maximumFlowRate: { value: 0.1, confidence: 'high' },
    flowRateUnit: { value: 'L/min', confidence: 'high' },
    minimumVolume: { value: 2, confidence: 'high' },
    maximumVolume: { value: 10, confidence: 'high' },
    volumeUnit: { value: 'L', confidence: 'high' },
    shipment: { value: null, confidence: 'low' },
    stabilityDays: { value: 30, confidence: 'medium' },
    stabilityText: { value: null, confidence: 'low' },
    storageTemperature: { value: null, confidence: 'low' },
    storageTemperatureUnit: { value: '°C', confidence: 'low' },
    extractionSolvent: { value: 'CS2', confidence: 'medium' },
    technique: { value: null, confidence: 'low' },
    analyte: { value: null, confidence: 'low' },
    detector: { value: null, confidence: 'low' },
    lod: { value: null, confidence: 'low' },
    range: { value: null, confidence: 'low' },
    applicability: { value: null, confidence: 'low' },
    interferences: { value: null, confidence: 'low' },
    observations: { value: null, confidence: 'low' },
  },
  occupationalLimits: {} as HoMethodImportParseResult['occupationalLimits'],
  agents: [
    {
      substanceName: 'Acetone',
      cas: '67-64-1',
      synonyms: [],
      matchedRiskFactor: null,
      found: false,
      matchConfidence: 'none',
      candidateRiskFactors: [],
    },
  ],
  canConfirm: false,
  confirmBlockReason: null,
});

describe('ho-method-import-ai-review-diff.util', () => {
  it('rejects invalid agent names', () => {
    expect(isInvalidHoMethodAiAgentName('Table 1')).toBe(true);
    expect(isInvalidHoMethodAiAgentName('Acetone')).toBe(false);
  });

  it('compares parser and AI agent counts', () => {
    const parserResult = baseParserResult();
    const aiResult: HoMethodAiReviewResult = {
      agents: Array.from({ length: 7 }, (_, index) => ({
        name: `Agent ${index + 1}`,
        confidence: 'high',
      })),
      diagnostics: { detectedTables: [], warnings: [] },
    };

    const comparison = buildHoMethodParserAiComparison(parserResult, aiResult);

    expect(comparison.parserAgentCount).toBe(1);
    expect(comparison.aiAgentCount).toBe(7);
    expect(comparison.differences?.[0]).toContain('7 agente');
  });
});
