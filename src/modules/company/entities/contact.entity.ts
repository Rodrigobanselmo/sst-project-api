import { Contact, StatusEnum } from '@prisma/client';

import { CompanyEntity } from './company.entity';

export class ContactEntity implements Contact {
  id: number;
  name: string;
  phone: string;
  phone_1: string;
  email: string;
  obs: string;
  companyId: string;
  isPrincipal: boolean;
  updated_at: Date;
  status: StatusEnum;
  created_at: Date;
  company?: CompanyEntity;

  constructor(partial: Partial<ContactEntity>) {
    Object.assign(this, partial);
  }
}
