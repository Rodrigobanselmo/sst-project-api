import { ProfessionalEntity } from './../../users/entities/professional.entity';
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

export class ProfessionalRiskGroupEntity implements RiskFactorGroupDataToUser {
  riskFactorGroupDataId: string;
  userId: number;
  isSigner: boolean;
  professional?: ProfessionalEntity;

  constructor(partial: Partial<UsersRiskGroupEntity>) {
    Object.assign(this, partial);
  }
}
