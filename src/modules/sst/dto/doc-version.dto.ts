import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { ToBoolean } from './../../../shared/decorators/boolean.decorator';

import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
import { DocumentTypeEnum } from '@prisma/client';
import { KeysOfEnum } from './../../../shared/utils/keysOfEnum.utils';

export class FindDocVersionDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  search: string;

  @IsString()
  @IsOptional()
  workspaceId: string;

  @IsString({ each: true })
  @IsOptional()
  documentDataId: string[];

  @IsOptional()
  @IsString()
  @IsEnum(DocumentTypeEnum, {
    message: `type must be one of: ${KeysOfEnum(DocumentTypeEnum)}`,
  })
  type: DocumentTypeEnum;
}
