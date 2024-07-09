import { RecMed, RecTypeEnum } from '.prisma/client';
import { MeasuresTypeEnum, StatusEnum } from '@prisma/client';
import { EngsRiskDataEntity } from './engsRiskData.entity';

export class RecMedEntity implements RecMed {
  id: string;
  riskId: string;
  recName: string;
  medName: string;
  companyId: string;
  system: boolean;
  medType: MeasuresTypeEnum;
  status: StatusEnum;
  created_at: Date;
  updated_at: Date;
  generateSourceId: string;
  deleted_at: Date | null;

  recType: RecTypeEnum;

  engsRiskData?: EngsRiskDataEntity;
  isAll?: boolean;

  constructor(partial: Partial<RecMedEntity>) {
    Object.assign(this, partial);
  }
}
