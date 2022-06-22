import { ApiProperty } from '@nestjs/swagger';
import { Professional } from '@prisma/client';

export class ProfessionalEntity implements Professional {
  @ApiProperty({ description: 'The id of the Company' })
  id: string;

  @ApiProperty({ description: 'The name of the Company' })
  name: string;

  @ApiProperty({ description: 'The creation date of the Company' })
  created_at: Date;

  @ApiProperty({
    description: 'The last time that the Company data was updated',
  })
  updated_at: Date;

  @ApiProperty({ description: 'The deleted date of data' })
  deleted_at: Date | null;

  companyId: string;
  userId: number;
  formation: string[];
  certifications: string[];
  nit: string;
  crea: string;

  constructor(partial: Partial<ProfessionalEntity>) {
    Object.assign(this, partial);
  }
}
