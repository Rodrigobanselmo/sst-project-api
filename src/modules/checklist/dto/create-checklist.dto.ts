import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { ChecklistDataDto } from './checklist-data';

export class CreateChecklistDto {
  @IsString()
  name: string;

  @IsString()
  companyId: string;

  @ValidateNested()
  @Type(() => ChecklistDataDto)
  data?: ChecklistDataDto;
}
