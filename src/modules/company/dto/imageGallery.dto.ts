import { PaginationQueryDto } from './../../../shared/dto/pagination.dto';
import { ImagesTypeEnum } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

import { StringCapitalizeTransform } from '../../../shared/transformers/string-capitalize';
import { KeysOfEnum } from '../../../shared/utils/keysOfEnum.utils';
import { QueryArray } from '../../../shared/transformers/query-array';

export class CreateImageGalleryDto {
  @Transform(StringCapitalizeTransform, { toClassOnly: true })
  @IsString()
  @MaxLength(500, { message: 'A imagem deve ter uma descrição com até 250 caracteres', })
  name: string;

  @IsOptional()
  @IsString({ each: true, })
  @IsEnum(ImagesTypeEnum, { each: true, message: `Valores aceitos: ${KeysOfEnum(ImagesTypeEnum)}`, })
  types?: ImagesTypeEnum[];

  @IsOptional()
  @IsString()
  companyId: string;
}

export class UpdateImageGalleryDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'A imagem deve ter uma descrição com até 250 caracteres', })
  name: string;

  @IsOptional()
  @IsString({ each: true, })
  @IsEnum(ImagesTypeEnum, { each: true, message: `Valores aceitos: ${KeysOfEnum(ImagesTypeEnum)}`, })
  types?: ImagesTypeEnum[];

  @IsOptional()
  @IsString()
  companyId: string;
}


export class FindImageGalleryDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  companyId?: string;

  @Transform(QueryArray, { toClassOnly: true })
  @IsString({ each: true })
  @IsOptional()
  types?: ImagesTypeEnum[];
}
