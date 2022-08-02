import { ApiProperty } from '@nestjs/swagger';

import { CompanyGroup } from '.prisma/client';

export class CompanyGroupEntity implements CompanyGroup {
  @ApiProperty({ description: 'The id of the CompanyGroups' })
  id: number;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;
  companyId: string;
  numAsos: number;
  blockResignationExam: boolean;
  esocialStart: Date;

  constructor(partial: Partial<CompanyGroupEntity>) {
    Object.assign(this, partial);
  }
}
