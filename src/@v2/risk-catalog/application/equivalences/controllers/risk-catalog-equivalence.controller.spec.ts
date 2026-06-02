import { describe, expect, it } from '@jest/globals';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { RoleEnum } from '@/shared/constants/enum/authorization';
import { ROLES_KEY } from '@/shared/decorators/roles.decorator';
import { RolesGuard } from '@/shared/guards/roles.guard';

import { RiskCatalogEquivalenceController } from './risk-catalog-equivalence.controller';

describe('RiskCatalogEquivalenceController access', () => {
  const reflector = new Reflector();
  const guard = new RolesGuard(reflector);

  const requiredRoles = Reflect.getMetadata(
    ROLES_KEY,
    RiskCatalogEquivalenceController,
  ) as RoleEnum[];

  const createContext = (user: {
    roles: string[];
    isMaster?: boolean;
  }): ExecutionContext =>
    ({
      getHandler: () => RiskCatalogEquivalenceController.prototype.search,
      getClass: () => RiskCatalogEquivalenceController,
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    }) as unknown as ExecutionContext;

  it('exige RoleEnum.MASTER no controller', () => {
    expect(requiredRoles).toEqual([RoleEnum.MASTER]);
  });

  it('bloqueia usuário sem MASTER', () => {
    const allowed = guard.canActivate(
      createContext({ roles: ['COMPANY_USER'], isMaster: false }),
    );
    expect(allowed).toBe(false);
  });

  it('permite usuário com role MASTER no JWT (RolesGuard ignora flag isMaster isolada)', () => {
    const allowed = guard.canActivate(
      createContext({ roles: [RoleEnum.MASTER], isMaster: false }),
    );
    expect(allowed).toBe(true);
  });
});
