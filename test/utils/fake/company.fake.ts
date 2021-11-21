import * as faker from 'faker';
import { LicenseDto } from 'src/modules/company/dto/license.dto';

import { ActivityDto } from '../../../src/modules/company/dto/activity.dto';
import { CreateCompanyDto } from '../../../src/modules/company/dto/create-company.dto';
import { WorkspaceDto } from '../../../src/modules/company/dto/workspace.dto';
import { CreateUserDto } from '../../../src/modules/users/dto/create-user.dto';
import {
  format,
  verifierDigit,
} from '../../../src/shared/transformers/cnpj-format.transform';

export function generate(useFormat = false): string {
  let numbers = '';

  for (let i = 0; i < 12; i += 1) {
    numbers += Math.floor(Math.random() * 9);
  }

  numbers += verifierDigit(numbers);
  numbers += verifierDigit(numbers);

  return useFormat ? format(numbers) : numbers;
}

export class FakeCompany implements CreateCompanyDto {
  constructor(partial?: Partial<CreateUserDto>) {
    Object.assign(this, partial);
  }

  cnpj = generate();
  name = faker.lorem.sentence();
  fantasy = faker.lorem.sentence();
  status = 'active';
  type = 'matriz';
  isConsulting = false;
  workspace: WorkspaceDto[] = [];
  primary_activity: ActivityDto[] = [];
  secondary_activity: ActivityDto[] = [];

  pushWorkspace(work: WorkspaceDto) {
    return this.workspace.push(work);
  }
}
