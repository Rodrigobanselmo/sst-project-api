import { StatusTypeEnum } from "@/@v2/security/@shared/domain/enums/status-type.enum"
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class AddStatusPayload {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  color?: string | null;

  @IsString()
  @IsEnum(StatusTypeEnum)
  type!: StatusTypeEnum;
}


