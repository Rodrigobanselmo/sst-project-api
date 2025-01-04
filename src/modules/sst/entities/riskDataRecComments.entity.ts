import { $Enums, RiskFactorDataRecComments, RiskRecTextTypeEnum, RiskRecTypeEnum } from '@prisma/client';

export class RiskDataRecCommentsEntity implements RiskFactorDataRecComments {
  id: string;
  text: string;
  type: RiskRecTypeEnum;
  textType: RiskRecTextTypeEnum;
  riskFactorDataRecId: string;
  updated_at: Date;
  created_at: Date;
  userId: number;
  isApproved: boolean;
  approvedAt: Date;
  approvedComment: string;
  approvedById: number;
  previous_status: $Enums.StatusEnum;
  previous_valid_date: Date;
  current_status: $Enums.StatusEnum;
  current_valid_date: Date;

  constructor(partial: Partial<RiskDataRecCommentsEntity>) {
    Object.assign(this, partial);
  }
}
