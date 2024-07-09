import { Prisma, Workspace } from '.prisma/client';
import { StatusEnum } from '@prisma/client';
import { AddressEntity } from './address.entity';
import { CompanyEntity } from './company.entity';

export class WorkspaceEntity implements Workspace {
  id: string;
  name: string;
  status: StatusEnum;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  companyId: string;
  address?: AddressEntity;
  company?: CompanyEntity;

  description: string;
  employeeCount?: number;

  constructor(partial: Partial<WorkspaceEntity>) {
    Object.assign(this, partial);
  }
  companyJson: Prisma.JsonValue;
  isOwner: boolean;
  cnpj: string;
  abbreviation: string;
}
