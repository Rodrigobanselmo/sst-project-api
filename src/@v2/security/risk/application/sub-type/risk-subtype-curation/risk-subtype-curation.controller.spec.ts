import { describe, expect, it } from '@jest/globals';

import { RoleEnum } from '@/shared/constants/enum/authorization';
import { ROLES_KEY } from '@/shared/decorators/roles.decorator';

import { RiskSubtypeCurationController } from './risk-subtype-curation.controller';

describe('RiskSubtypeCurationController — MASTER-only', () => {
  it('8. controller exige RoleEnum.MASTER', () => {
    const roles = Reflect.getMetadata(
      ROLES_KEY,
      RiskSubtypeCurationController,
    ) as RoleEnum[] | undefined;
    expect(roles).toContain(RoleEnum.MASTER);
  });
});
