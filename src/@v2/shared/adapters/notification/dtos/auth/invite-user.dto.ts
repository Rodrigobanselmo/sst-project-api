import { NotificationEnum } from '@/@v2/communications/base/domain/enums/notification.enum';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class InviteUserDto {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  companyId: string;

  @IsString()
  @IsEnum(NotificationEnum)
  type: NotificationEnum.INVITE_USER;
}
