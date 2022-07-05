import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

import { StringCapitalizeParagraphTransform } from '../../../shared/transformers/string-capitalize-paragraph';

export class AttachmentDto {
  @IsString()
  @IsOptional()
  id?: string;

  @Transform(StringCapitalizeParagraphTransform, { toClassOnly: true })
  @IsString()
  name: string;

  @IsString()
  riskFactorDocumentId?: string;

  @IsString()
  url: string;
}
