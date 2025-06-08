import { NotificationEnum } from '@/@v2/communications/base/domain/enums/notification.enum';
import { Type } from 'class-transformer';
import { IsAlpha, IsArray, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ActionPlanNewTasksDto {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  companyId: string;

  @IsString()
  @IsEnum(NotificationEnum)
  type: NotificationEnum.ACTION_PLAN_NEW_TASKS;

  @IsArray()
  @IsString({ each: true })
  ids: string[];
}
