import { MessageEnum } from './../../../shared/constants/enum/message.enum';
import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDefined, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from './../../../shared/dto/pagination.dto';
import { ToBoolean } from './../../../shared/decorators/boolean.decorator';
import { KeysOfEnum } from './../../../shared/utils/keysOfEnum.utils';

import { QueryArray } from './../../../shared/transformers/query-array';

export class MessageNotificationDto {
  @IsString()
  @IsOptional()
  message?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsString()
  @IsEnum(MessageEnum, {
    message: `tipos disponíveis: ${KeysOfEnum(MessageEnum)}`,
  })
  type?: MessageEnum;
}

export class CreateNotificationDto {
  @IsString({ each: true })
  @IsOptional()
  companiesIds?: string[];

  @IsInt({ each: true })
  @IsOptional()
  usersIds?: number[];

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  isClinic?: boolean;
  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  isConsulting?: boolean;
  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  isCompany?: boolean;

  @IsString()
  @IsOptional()
  repeatId?: string;

  @IsDefined()
  json: MessageNotificationDto;
}

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {
  @IsInt()
  @IsOptional()
  id: number;

  @IsOptional()
  json?: MessageNotificationDto;
}

export class UpdateUserNotificationDto {
  @IsInt()
  @IsOptional()
  id: number;

  @IsInt({ each: true })
  @IsOptional()
  ids: number[];

  @IsInt()
  @IsOptional()
  userId: number;
}

export class FindNotificationDto extends PaginationQueryDto {
  @Transform(QueryArray, { toClassOnly: true })
  @IsString({ each: true })
  @IsOptional()
  companiesIds?: string[];

  @Transform(QueryArray, { toClassOnly: true })
  @IsInt({ each: true })
  @IsOptional()
  usersIds?: number[];

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  isClinic?: boolean;
  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  isConsulting?: boolean;
  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  isCompany?: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  isUnread?: boolean;
}
