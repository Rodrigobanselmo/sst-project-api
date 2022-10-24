import { ApiProperty } from '@nestjs/swagger';

import { Checklist, StatusEnum } from '.prisma/client';
import { ChecklistDataEntity } from './checklistData.entity';
import { Transform } from 'class-transformer';
import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { KeysOfEnum } from '../../../shared/utils/keysOfEnum.utils';

export class ChecklistEntity implements Checklist {
  @ApiProperty({
    description: 'The id of the recommendation or control measure',
  })
  id: number;

  @ApiProperty({ description: 'the recommendation description' })
  name: string;

  @ApiProperty({
    description:
      'The company id related to the recommendation or control measure',
  })
  companyId: string;

  @ApiProperty({
    description: 'If was created from one of simple professionals',
  })
  system: boolean;

  @ApiProperty({ description: 'The creation date of the risk' })
  created_at: Date;

  @ApiProperty({ description: 'The checklist data' })
  checklistData?: ChecklistDataEntity;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
  @IsEnum(StatusEnum, {
    message: `status must be one of: ${KeysOfEnum(StatusEnum)}`,
  })
  status: StatusEnum;

  constructor(partial: Partial<ChecklistEntity>) {
    Object.assign(this, partial);
  }
}
