
import { Checklist, StatusEnum } from '.prisma/client';
import { ChecklistDataEntity } from './checklistData.entity';
import { Transform } from 'class-transformer';
import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { KeysOfEnum } from '../../../shared/utils/keysOfEnum.utils';

export class ChecklistEntity implements Checklist {
  id: number;
  name: string;
  companyId: string;
  system: boolean;
  created_at: Date;
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
