import { ApiProperty } from '@nestjs/swagger';
import { CompanyCharacterizationPhoto } from '@prisma/client';

export class CharacterizationPhotoEntity
  implements CompanyCharacterizationPhoto
{
  @ApiProperty({ description: 'The id of the company environment photo' })
  id: string;

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
  companyCharacterizationId: string;

  constructor(partial: Partial<CharacterizationPhotoEntity>) {
    Object.assign(this, partial);
  }
}
