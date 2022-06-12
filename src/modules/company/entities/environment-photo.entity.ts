import { ApiProperty } from '@nestjs/swagger';
import { CompanyEnvironmentPhoto } from '@prisma/client';

export class EnvironmentPhotoEntity implements CompanyEnvironmentPhoto {
  @ApiProperty({ description: 'The id of the company environment photo' })
  id: string;

  @ApiProperty({
    description: 'The company environment id of the company environment photo',
  })
  companyEnvironmentId: string;

  @ApiProperty({ description: 'The name of the company environment photo' })
  name: string;

  @ApiProperty({
    description: 'The url of the company environment photo',
  })
  photoUrl: string | null;

  @ApiProperty({
    description: 'The creation date of the company environment photo',
  })
  created_at: Date;

  deleted_at: Date;
  updated_at: Date;

  constructor(partial: Partial<EnvironmentPhotoEntity>) {
    Object.assign(this, partial);
  }
}
