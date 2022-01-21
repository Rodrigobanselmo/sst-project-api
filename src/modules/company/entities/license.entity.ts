import { ApiProperty } from '@nestjs/swagger';

import { CompanyEntity } from './company.entity';
import { License } from '.prisma/client';

export class LicenseEntity implements License {
  @ApiProperty({ description: 'The id of the License' })
  id: number;

  @ApiProperty({ description: 'The company id related to the License' })
  companyId: string;

  @ApiProperty({
    description: 'The current status of the License',
    examples: ['ACTIVE', 'PENDING', 'CANCELED'],
  })
  status: string;

  @ApiProperty({ description: 'The creation date of the License' })
  created_at: Date;

  @ApiProperty({ description: 'The companies related to the License' })
  companies?: CompanyEntity[];

  constructor(partial: Partial<License>) {
    Object.assign(this, partial);
  }
}
