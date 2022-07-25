import { ApiProperty } from '@nestjs/swagger';
import { CompanyCharacterizationPhoto } from '@prisma/client';

export class EnvironmentPhotoEntity implements CompanyCharacterizationPhoto {
  @ApiProperty({ description: 'The id of the company environment photo' })
  id: string;

  @ApiProperty({
    description: 'The company environment id of the company environment photo',
  })
  companyCharacterizationId: string;

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

  isVertical: boolean;
  deleted_at: Date;
  updated_at: Date;
  order: number;

  constructor(partial: Partial<EnvironmentPhotoEntity>) {
    Object.assign(this, partial);
  }
}
