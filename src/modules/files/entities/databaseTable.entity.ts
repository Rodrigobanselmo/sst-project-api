import { ApiProperty } from '@nestjs/swagger';
import { DatabaseTable, StatusEnum } from '@prisma/client';

export class DatabaseTableEntity implements DatabaseTable {
  @ApiProperty({ description: 'The id of the database table' })
  id: number;

  @ApiProperty({ description: 'The name of the database table' })
  name: string;

  @ApiProperty({ description: 'The actual version of the database table' })
  version: number;

  @ApiProperty({ description: 'The company owner of the database table' })
  companyId: string;

  @ApiProperty({
    description: 'If the data was created from one of simple professionals',
  })
  system: boolean;

  @ApiProperty({ description: 'The actual status of the database table' })
  status: StatusEnum;

  @ApiProperty({ description: 'The creation date of the data' })
  created_at: Date;

  @ApiProperty({ description: 'The last update of the table date' })
  updated_at: Date;

  constructor(partial: Partial<DatabaseTableEntity>) {
    Object.assign(this, partial);
  }
}
