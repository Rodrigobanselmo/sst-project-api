import { describe, expect, it, jest } from '@jest/globals';
import { Logger } from '@nestjs/common';

import {
  extractSuggestErrorMeta,
  RiskSubtypeSuggestObservability,
} from './risk-subtype-curation-suggest-observability.util';

describe('risk-subtype-curation-suggest-observability.util', () => {
  it('extractSuggestErrorMeta identifica AI_TIMEOUT', () => {
    expect(extractSuggestErrorMeta(new Error('AI_TIMEOUT'))).toEqual({
      message: 'AI_TIMEOUT',
      code: 'AI_TIMEOUT',
      status: undefined,
    });
  });

  it('RiskSubtypeSuggestObservability emite JSON estruturado', () => {
    const logger = new Logger('test');
    const logSpy = jest.spyOn(logger, 'log').mockImplementation(() => undefined);
    const observability = new RiskSubtypeSuggestObservability(logger);

    observability.setStage('db');
    observability.log('risk_subtype_suggest_start', {
      subTypeId: 10,
      page: 1,
    });

    expect(logSpy).toHaveBeenCalledTimes(1);
    const payload = JSON.parse(String(logSpy.mock.calls[0][0]));
    expect(payload).toMatchObject({
      event: 'risk_subtype_suggest_start',
      requestId: observability.requestId,
      subTypeId: 10,
      page: 1,
    });
    expect(payload.requestId).toEqual(expect.any(String));

    logSpy.mockRestore();
  });
});
