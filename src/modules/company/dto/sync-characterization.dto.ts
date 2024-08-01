import { Transform, Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { DateFormat } from 'src/shared/transformers/date-format';


export class SyncCharacterizationDto {
  @IsString()
  companyId: string;

  @IsString()
  workspaceId: string;

  @IsOptional()
  @Transform(DateFormat, { toClassOnly: true })
  @IsDate({ message: 'Data de início inválida' })
  @Type(() => Date)
  lastSync?: Date;
}
