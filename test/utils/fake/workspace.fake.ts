import * as faker from 'faker';
import { WorkspaceDto } from '../../../src/modules/company/dto/workspace.dto';
import { FakeAddress } from './address.fake';

export class FakeWorkspace implements WorkspaceDto {
  constructor(partial?: Partial<WorkspaceDto>) {
    Object.assign(this, partial);
  }
  name = faker.lorem.sentence();
  status = 'active';
  address = new FakeAddress();
}
