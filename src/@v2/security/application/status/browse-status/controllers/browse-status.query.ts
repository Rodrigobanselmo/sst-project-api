import { StatusTypeEnum } from '@/@v2/security/domain/enums/status-type.enum';
import { IsEnum, IsOptional, IsString } from 'class-validator';


export class BrowseStatusQuery {
  @IsString()
  @IsOptional()
  @IsEnum(StatusTypeEnum)
  type?: StatusTypeEnum;
}


