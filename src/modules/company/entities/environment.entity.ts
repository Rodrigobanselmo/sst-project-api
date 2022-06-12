import { ApiProperty } from '@nestjs/swagger';
import {
  CompanyEnvironment,
  CompanyEnvironmentTypesEnum,
} from '@prisma/client';
import { EnvironmentPhotoEntity } from './environment-photo.entity';

import { WorkspaceEntity } from './workspace.entity';

export class EnvironmentEntity implements CompanyEnvironment {
  @ApiProperty({ description: 'The id of the company environment' })
  id: string;

  @ApiProperty({ description: 'The name of the company environment' })
  name: string;

  @ApiProperty({ description: 'The description of the company environment' })
  description: string | null;

  @ApiProperty({ description: 'The creation date of the company environment' })
  created_at: Date;

  @ApiProperty({
    description: 'The type of the company environment',
    examples: [...Object.values(CompanyEnvironmentTypesEnum)],
  })
  type: CompanyEnvironmentTypesEnum;

  @ApiProperty({ description: 'The parent id of the company environment' })
  parentEnvironmentId: string;

  @ApiProperty({ description: 'The workspace of the company environment' })
  workspace?: WorkspaceEntity;

  @ApiProperty({ description: 'The photos related to the company environment' })
  photos?: EnvironmentPhotoEntity[];

  constructor(partial: Partial<EnvironmentEntity>) {
    Object.assign(this, partial);
  }
  vision: string;
  deleted_at: Date;
  updated_at: Date;
  workspaceId: string;
  companyId: string;
}
