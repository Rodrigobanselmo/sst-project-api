import { IsOptional, IsString } from 'class-validator';

export class CouncilDto {
  @IsString()
  councilType: string;

  @IsString()
  councilUF: string;

  @IsString()
  councilId: string;

  @IsString()
  @IsOptional()
  professionalId?: string;
}
