import { ApiProperty } from '@nestjs/swagger';
import { Contract, StatusEnum } from '@prisma/client';

import { CompanyEntity } from './company.entity';

export class ContractEntity implements Contract {
  @ApiProperty({ description: 'The id of the Company' })
  id: string;

  applyingServiceCompanyId: string;
  receivingServiceCompanyId: string;
  status: StatusEnum;
  created_at: Date;
  applyingServiceCompany?: CompanyEntity;
  receivingServiceCompany?: CompanyEntity;

  constructor(partial: Partial<ContractEntity>) {
    Object.assign(this, partial);
  }
}