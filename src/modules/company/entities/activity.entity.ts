import { ApiProperty } from '@nestjs/swagger';
import { Activity } from '@prisma/client';

export class ActivityEntity implements Activity {
  @ApiProperty({ description: 'The id of the Company' })
  id: number;

  code: string;
  name: string;
  created_at: Date;
  riskDegree: number;

  constructor(partial: Partial<ActivityEntity>) {
    Object.assign(this, partial);
  }
}
