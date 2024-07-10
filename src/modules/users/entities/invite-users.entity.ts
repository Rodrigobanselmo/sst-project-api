import { InviteUsers } from '.prisma/client';
import { ProfessionalEntity } from './professional.entity';

export class InviteUsersEntity implements InviteUsers {
  id: string;
  email: string;
  roles: string[];
  permissions: string[];
  expires_date: Date;
  companyId: string;
  companyName?: string;
  logo?: string;

  companiesIds: string[];
  groupId: number;
  professional: ProfessionalEntity;

  constructor(partial: Partial<InviteUsersEntity>) {
    Object.assign(this, partial);
  }
}
