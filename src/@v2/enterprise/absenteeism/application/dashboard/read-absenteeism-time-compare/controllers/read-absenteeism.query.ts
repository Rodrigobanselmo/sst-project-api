import { TimeCountRangeEnum } from '@/@v2/enterprise/absenteeism/constants/time-count-range';
import { AbsenteeismHierarchyTypeEnum } from '@/@v2/enterprise/absenteeism/domain/enums/absenteeism-hierarchy-type';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsString, ValidateNested } from 'class-validator';

class Item {
  @IsEnum(AbsenteeismHierarchyTypeEnum)
  type!: AbsenteeismHierarchyTypeEnum;

  @IsString()
  id!: string;
}

export class ReadAbsenteeismQuery {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Item)
  items?: Item[];

  @IsEnum(TimeCountRangeEnum)
  range!: TimeCountRangeEnum;
}
