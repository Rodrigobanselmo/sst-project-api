import { ProfessionalEntity } from './../../users/entities/professional.entity';
import {
  RiskFactorGroupDataToUser,
  RiskFactorGroupDataToProfessional,
} from '@prisma/client';

import { UserEntity } from './../../users/entities/user.entity';

export class UsersRiskGroupEntity implements RiskFactorGroupDataToUser {
  riskFactorGroupDataId: string;
  userId: number;
  isSigner: boolean;
  isElaborator: boolean;
  user?: UserEntity;

  constructor(partial: Partial<UsersRiskGroupEntity>) {
    Object.assign(this, partial);
  }
}

export class ProfessionalRiskGroupEntity
  implements RiskFactorGroupDataToProfessional
{
  riskFactorGroupDataId: string;
  professionalId: number;
  isSigner: boolean;
  isElaborator: boolean;
  professional?: ProfessionalEntity;

  constructor(partial: Partial<UsersRiskGroupEntity>) {
    Object.assign(this, partial);
  }
}
