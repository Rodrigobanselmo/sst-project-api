import { ApiProperty } from '@nestjs/swagger';

import { Address } from '.prisma/client';
import { WorkspaceEntity } from './workspace.entity';
import { StatusEnum } from '@prisma/client';

export class AddressEntity implements Address {
  @ApiProperty({ description: 'address id.' })
  id: number;

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

  @ApiProperty({ description: 'address state.', enum: StatusEnum })
  state: StatusEnum;

  @ApiProperty({ description: 'company id.' })
  companyId: string;

  @ApiProperty({ description: 'address workspace id.' })
  workspaceId: number;

  @ApiProperty({ description: 'The workspace related to the address' })
  workspace?: WorkspaceEntity;

  constructor(partial: Partial<AddressEntity>) {
    Object.assign(this, partial);
  }
}
