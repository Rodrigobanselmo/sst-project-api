import { CoverTypeEnum } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';

class LogoPropsDto {
  @IsOptional()
  @IsNumber()
  maxLogoHeight?: number;

  @IsOptional()
  @IsNumber()
  maxLogoWidth?: number;

  @IsOptional()
  @IsNumber()
  x?: number;

  @IsOptional()
  @IsNumber()
  y?: number;
}

class TextPropsDto {
  @IsOptional()
  @IsNumber()
  x?: number;

  @IsOptional()
  @IsNumber()
  y?: number;

  @IsOptional()
  @IsNumber()
  boxX?: number;

  @IsOptional()
  @IsNumber()
  boxY?: number;

  @IsOptional()
  @IsNumber()
  size?: number;

  @IsOptional()
  @IsString()
  color?: string;
}

class CoverPropsDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => LogoPropsDto)
  logoProps?: LogoPropsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => TextPropsDto)
  titleProps?: TextPropsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => TextPropsDto)
  versionProps?: TextPropsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => TextPropsDto)
  companyProps?: TextPropsDto;

  @IsOptional()
  @IsString()
  backgroundImagePath?: string;
}

class CoverJsonDto {
  @ValidateNested()
  @Type(() => CoverPropsDto)
  coverProps: CoverPropsDto;
}

export class CreateDocumentCoverDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(CoverTypeEnum, { each: true })
  acceptType?: CoverTypeEnum[];

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
  @ValidateNested()
  @Type(() => CoverJsonDto)
  json?: CoverJsonDto;
}

export class UpdateDocumentCoverDto extends CreateDocumentCoverDto {
  @IsInt()
  @Type(() => Number)
  id: number;
}

export class FindDocumentCoverDto {
  @IsOptional()
  @IsString()
  companyId?: string;
}

