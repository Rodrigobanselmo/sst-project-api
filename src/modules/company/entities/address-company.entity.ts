import { ApiProperty } from '@nestjs/swagger';

import { AddressCompany } from '.prisma/client';
import { StatusEnum } from '@prisma/client';

export class AddressCompanyEntity implements AddressCompany {
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

  @ApiProperty({ description: 'address state.', enum: StatusEnum })
  state: string;

  @ApiProperty({ description: 'company id.' })
  companyId: string;

  constructor(partial: Partial<AddressCompanyEntity>) {
    Object.assign(this, partial);
  }
}
