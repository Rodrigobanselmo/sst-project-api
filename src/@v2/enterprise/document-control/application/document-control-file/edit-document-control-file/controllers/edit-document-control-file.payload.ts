import { IsNotNull } from '@/@v2/shared/decorators/validators/is-not-null.decorator';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class EditDocumentControlFilePayload {
  @IsString()
  @IsOptional()
  @IsNotNull()
  fileId?: string;

  @IsString()
  @IsNotNull()
  @IsOptional()
  name?: string;

  @IsDate()
  @IsOptional()
  endDate?: Date;

  @IsDate()
  @IsOptional()
  startDate?: Date;

  @IsString()
  @IsOptional()
  description?: string;
}
