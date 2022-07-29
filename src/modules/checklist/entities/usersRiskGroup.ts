import { RiskFactorGroupDataToUser } from '@prisma/client';

import { UserEntity } from './../../users/entities/user.entity';

export class UsersRiskGroupEntity implements RiskFactorGroupDataToUser {
  riskFactorGroupDataId: string;
  userId: number;
  isSigner: boolean;
  user?: UserEntity;

  constructor(partial: Partial<UsersRiskGroupEntity>) {
    Object.assign(this, partial);
  }
}
