import { CompanyCert } from '@prisma/client';

export class CompanyCertEntity implements CompanyCert {
  id: string;
  key: string;
  certificate: string;
  notAfter: Date;
  notBefore: Date;
  companyId: string;

  constructor(partial: Partial<CompanyCertEntity>) {
    Object.assign(this, partial);
  }
}
