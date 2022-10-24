import { IsBoolean, IsOptional, IsString } from 'class-validator';

import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';

export class FindDocVersionDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  search: string;

  @IsString()
  @IsOptional()
  workspaceId: string;

  @IsString({ each: true })
  @IsOptional()
  riskGroupId: string[];

  @IsString({ each: true })
  @IsOptional()
  pcmsoId: string[];

  @IsBoolean()
  @IsOptional()
  isPGR: boolean;

  @IsBoolean()
  @IsOptional()
  isPCMSO: boolean;
}
