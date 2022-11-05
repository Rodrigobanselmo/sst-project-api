import { ApiProperty } from '@nestjs/swagger';
import { CompanyCert } from '@prisma/client';

export class CompanyCertEntity implements CompanyCert {
  @ApiProperty({ description: 'The id of the certification' })
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
