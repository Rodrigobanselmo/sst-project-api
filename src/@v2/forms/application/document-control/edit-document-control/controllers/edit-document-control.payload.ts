import { IsNotNull } from '@/@v2/shared/decorators/validators/is-not-null.decorator';
import { IsOptional, IsString } from 'class-validator';

export class EditDocumentControlPayload {
  @IsString()
  @IsNotNull()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsString()
  @IsNotNull()
  @IsOptional()
  type?: string;
}
