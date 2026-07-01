import { describe, expect, it } from '@jest/globals';
import { RoleEnum } from '@/shared/constants/enum/authorization';
import { ROLES_KEY } from '@/shared/decorators/roles.decorator';

import { ExamRiskRuleController } from './exam-risk-rule.controller';

describe('ExamRiskRuleController — MASTER-only', () => {
  it('10. controller da Biblioteca exige RoleEnum.MASTER (cobre coverage-gaps)', () => {
    const roles = Reflect.getMetadata(ROLES_KEY, ExamRiskRuleController);
    expect(roles).toContain(RoleEnum.MASTER);
  });
});
