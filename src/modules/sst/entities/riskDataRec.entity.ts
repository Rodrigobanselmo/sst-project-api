import { RiskFactorDataRec, StatusEnum } from '@prisma/client';
import { RiskDataRecCommentsEntity } from './riskDataRecComments.entity';

export class RiskDataRecEntity implements RiskFactorDataRec {
  id: string;
  responsibleName: string;
  endDate: Date;
  comment: string;
  status: StatusEnum;
  recMedId: string;
  companyId: string;
  riskFactorDataId: string;
  comments?: RiskDataRecCommentsEntity[];
  updated_at: Date;
  created_at: Date;
  startDate: Date;
  doneDate: Date;
  canceledDate: Date;
  workspaceId: string;
  responsibleId: number;
  responsible_updated_at: Date | null;
  responsible_notified_at: Date | null;

  constructor(partial: Partial<RiskDataRecEntity>) {
    Object.assign(this, partial);
  }
}
