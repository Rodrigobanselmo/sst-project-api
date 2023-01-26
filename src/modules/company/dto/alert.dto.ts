import { AlertsTypeEnum } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export class ConfigAlertJsonDto {
  @IsInt({ each: true })
  @IsOptional()
  weekDays?: number[];

  @IsInt()
  @IsOptional()
  everyNumbersOfWeeks?: number;

  @IsInt()
  @IsOptional()
  time?: number;
}

export class AlertDto {
  @IsString()
  companyId: string;

  @IsString()
  @IsEnum(AlertsTypeEnum, {
    message: `tipo alerta inválido`,
  })
  type: AlertsTypeEnum;

  @IsOptional()
  @IsString({ each: true })
  emails?: string[];

  @IsOptional()
  @IsInt({ each: true })
  usersIds?: number[];

  @IsOptional()
  @IsInt({ each: true })
  groupsIds?: number[];

  @IsOptional()
  @IsString({ each: true })
  removeEmails?: string[];

  @IsOptional()
  @IsInt({ each: true })
  removeUsersIds?: number[];

  @IsOptional()
  @IsInt({ each: true })
  removeGroupsIds?: number[];

  @IsOptional()
  configJson?: ConfigAlertJsonDto;
}

export class AlertSendDto {
  @IsString()
  companyId: string;

  @IsString()
  @IsEnum(AlertsTypeEnum, {
    message: `tipo alerta inválido`,
  })
  type: AlertsTypeEnum;
}
