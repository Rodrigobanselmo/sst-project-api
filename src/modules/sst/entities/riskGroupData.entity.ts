import { StatusEnum } from '@prisma/client';

import { CompanyEntity } from '../../company/entities/company.entity';
import { RiskFactorDataEntity } from './riskData.entity';
import { RiskFactorGroupData } from '.prisma/client';

export class RiskFactorGroupDataEntity implements RiskFactorGroupData {
  id: string;
  name: string;
  companyId: string;
  status: StatusEnum;
  created_at: Date;
  data?: Partial<RiskFactorDataEntity>[];
  company?: Partial<CompanyEntity>;

  constructor(partial: Partial<RiskFactorGroupDataEntity>) {
    Object.assign(this, partial);

    if (partial?.data) {
      this.data = partial.data.map((d) => new RiskFactorDataEntity(d as any));
    }
  }
}
