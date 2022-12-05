import { CompanyOS, Prisma, StatusEnum } from '@prisma/client';

import { CompanyEntity } from './company.entity';

export class CompanyOSEntity implements CompanyOS {
  id: number;
  created_at: Date;
  updated_at: Date;
  status: StatusEnum;
  socialName: Prisma.JsonValue;
  med: Prisma.JsonValue;
  rec: Prisma.JsonValue;
  obligations: Prisma.JsonValue;
  prohibitions: Prisma.JsonValue;
  procedures: Prisma.JsonValue;
  cipa: Prisma.JsonValue;
  declaration: Prisma.JsonValue;
  companyId: string;
  company: CompanyEntity;

  constructor(partial: Partial<CompanyOSEntity>) {
    Object.assign(this, partial);

    if (this.company) {
      this.company = new CompanyEntity(this.company);
    }
  }
}
