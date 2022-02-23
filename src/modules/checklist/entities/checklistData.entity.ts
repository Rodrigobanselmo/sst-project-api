import { ApiProperty } from '@nestjs/swagger';

import { ChecklistData, Prisma } from '.prisma/client';

export class ChecklistDataEntity implements ChecklistData {
  @ApiProperty({
    description: 'The id of the recommendation or control measure',
  })
  checklistId: number;

  @ApiProperty({ description: 'the checklist json data' })
  json: Prisma.JsonValue;

  constructor(partial: Partial<ChecklistDataEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ description: 'the company id related' })
  companyId: string;
}
