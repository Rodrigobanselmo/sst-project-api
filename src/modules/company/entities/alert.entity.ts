import { AccessGroups, Alert, AlertsTypeEnum, Company, User } from '@prisma/client';
import { AlertDto } from '../dto/alert.dto';

import { AccessGroupsEntity } from './../../auth/entities/access-groups.entity';
import { UserEntity } from './../../users/entities/user.entity';
import { CompanyEntity } from './company.entity';

export class AlertEntity implements Alert {
  id: number;
  type: AlertsTypeEnum;
  companyId: string;
  system: boolean;
  emails: string[];
  nextAlert: Date;
  configJson: any;
  defaultNextAlert: Date | null;

  users?: UserEntity[];
  groups?: AccessGroupsEntity[];
  systemGroups?: AccessGroupsEntity[];
  company?: CompanyEntity;

  constructor(partial: Partial<Alert> & { users?: Partial<User>[]; groups?: Partial<AccessGroups>[]; company?: Partial<Company> }) {
    Object.assign(this, partial);

    if (this.company) {
      this.company = new CompanyEntity(this.company);
    }

    if (this.users) {
      this.users = this.users.map((user) => new UserEntity(user));
    }

    if (this.groups) {
      this.groups = this.groups.map((user) => new AccessGroupsEntity(user));
    }
    if (this.systemGroups) {
      this.systemGroups = this.systemGroups.map((user) => new AccessGroupsEntity(user));
    }
  }
}

export const isMissingDataConfigJson = (configJson?: AlertDto['configJson']) => {
  if (!configJson?.everyNumbersOfWeeks) return true;
  if (!configJson?.weekDays) return true;
  if (configJson.weekDays.length == 0) return true;
};
