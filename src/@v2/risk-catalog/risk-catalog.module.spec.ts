import { describe, expect, it } from '@jest/globals';
import { Test } from '@nestjs/testing';

import { SharedTokens } from '@/@v2/shared/constants/tokens';

import { RiskCatalogModule } from './risk-catalog.module';

describe('RiskCatalogModule', () => {
  it('exporta Context para JwtAuthGuard do controller Master', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [RiskCatalogModule],
    }).compile();

    const context = moduleRef.get(SharedTokens.Context);
    expect(context).toBeDefined();
    expect(typeof context.set).toBe('function');
  });
});
