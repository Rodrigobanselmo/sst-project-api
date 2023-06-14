import { ApiProperty } from '@nestjs/swagger';

import { Address } from '.prisma/client';
import { WorkspaceEntity } from './workspace.entity';

export class AddressEntity implements Address {
  @ApiProperty({ description: 'address id.' })
  id: string;

  @ApiProperty({ description: 'address number.' })
  number: string;

  @ApiProperty({ description: 'address cep.' })
  cep: string;

  @ApiProperty({ description: 'address street.' })
  street: string;

  @ApiProperty({ description: 'address complement.' })
  complement: string;

  @ApiProperty({ description: 'address neighbor.' })
  neighborhood: string;

  @ApiProperty({ description: 'address city.' })
  city: string;

  @ApiProperty({ description: 'address state.' })
  state: string;

  @ApiProperty({ description: 'company id.' })
  companyId: string;

  @ApiProperty({ description: 'address workspace id.' })
  workspaceId: string;

  @ApiProperty({ description: 'The workspace related to the address' })
  workspace?: WorkspaceEntity;

  constructor(partial: Partial<AddressEntity>) {
    Object.assign(this, partial);
  }
}
