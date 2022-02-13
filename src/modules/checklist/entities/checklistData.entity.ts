import { ApiProperty } from '@nestjs/swagger';

import { ChecklistData, Prisma } from '.prisma/client';
import { ChecklistEntity } from './checklist.entity';

export class ChecklistDataEntity implements ChecklistData {
  @ApiProperty({
    description: 'The id of the recommendation or control measure',
  })
  checklistId: number;

  @ApiProperty({ description: 'the checklist json data' })
  json: Prisma.JsonValue;

  @ApiProperty({ description: 'The checklist owner' })
  checklist?: ChecklistEntity;

  constructor(partial: Partial<ChecklistDataEntity>) {
    Object.assign(this, partial);
  }
}
