import { IsOptional, IsString } from 'class-validator';

export class BrowseStatusQuery {
  @IsString()
  @IsOptional()
  type?: string;
}
