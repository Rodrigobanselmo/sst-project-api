import { IsInt, IsOptional, IsString, IsArray, MaxLength, Min, Max, IsIn, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateThreadDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;
}

export class UpdateThreadDto {
  @IsString()
  @MaxLength(255)
  title: string;
}

export class PageContextDto {
  @IsOptional()
  @IsString()
  companyId?: string;

  @IsOptional()
  @IsString()
  homogeneousGroupId?: string;

  @IsOptional()
  @IsString()
  hierarchyId?: string;
}

export class SendMessageDto {
  @IsString()
  message: string;

  @IsOptional()
  @IsIn(['fast', 'smarter'])
  mode?: 'fast' | 'smarter';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fileIds?: string[];

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PageContextDto)
  pageContext?: PageContextDto;
}

export class ListThreadsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  first?: number;

  @IsOptional()
  @IsString()
  after?: string;

  @IsOptional()
  @IsString()
  search?: string;
}

export class ListMessagesQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  first?: number;

  @IsOptional()
  @IsString()
  before?: string;
}
